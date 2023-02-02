import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }


  }, [dispatch, history, orderId, userInfo, successPay, successDeliver, order])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult,))

    const msg = {
      Host: "smtp.elasticemail.com",
      Port: 2525,
      Username: "zishan.ahmed1210@gmail.com",
      Password: "DEC4ABE579F004A01E9CEE0E572AD6DB8F0E",
      To: order.user.email,
      From: "zishan.ahmed1210@gmail.com",
      Subject: "Payment Successful",
      Body: `<body style="margin: auto;width: 50%;font-size:14px;">
      <h1 style="color:green">Payment Completed !</h1>
      <p>Dear <strong>${order.user.name}</strong>,</p>
      <p>Thank you for your recent purchase!</p>
      <p>We are pleased to confirm that, Payment for your order: <strong>${order._id}</strong> has been received and will be processed shortly.</p>
      <h2>Order Details:</h2>
      <table>
        <thead>
          <tr style="background-color:cyan;text-align: center;">
            <th style="width:300px;height:25px;text-align: center;">Product Name</th>
            <th style="width:150px;height:25px;text-align: center;">Quantity</th>
            <th style="width:150px;height:30px;text-align: center;">Price</th>
          </tr>
        </thead>
        <tbody>
         
         ${order.orderItems.map((item) => (
        '<tr><td style="text-align: center;">' + item.name + '</td><td style="text-align: center;">' + item.qty + '</td><td style="text-align: center;">' + item.price + '</td></tr>'))}
        <hr style="width:200%;">
        <tr>
            <td></td>
            <td style="text-align: center;"><strong>Items Total Price</strong></td>
            <td style="text-align: center;"><strong>${order.itemsPrice}</strong></td>
        </tr>
        <tr>
            <td></td>
            <td style="text-align: center;"><strong>Shipping</strong></td>
            <td style="text-align: center;"><strong>${order.shippingPrice}</strong></td>
        </tr>
        <tr>
            <td></td>
            <td style="text-align: center;"><strong>Tax</strong></td>
            <td style="text-align: center;"><strong>${order.taxPrice}</strong></td>
        </tr>
        <hr style="width:120%;margin-left:17em;margin-right:auto">   
        <tr>
            <td></td>
            <td style="text-align: center;"><strong>Grand Total</strong></td>
            <td style="text-align: center;"><strong>$${order.totalPrice}</strong></td>
          </tr>
        </tbody>
      </table>
      <p>Your order will be shipped to the following address:<br>
      <strong>${order.shippingAddress.address}, ${order.shippingAddress.city}- ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</strong></p>
      <p>If you have any questions, please do not hesitate to contact us at <a href="#">info@primeecom.com</a>.</p>
      <p>Thank you again for your order!</p>
      <br>
      <p>Best regards,</p>
      <p>Prime E-commerce</p>
      </body>`
    }
    window.Email.send(msg)
    // .then(()=>{})
    // .catch((error)=>{error})
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
