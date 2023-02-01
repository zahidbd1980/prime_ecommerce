import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

var verificationCode = 0

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [message, setMessage] = useState(null)

  const [disable, setDisable] = useState(false);

  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    verificationCode = Math.floor(1000 + Math.random() * 9000)
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      const msg = {
        Host: "smtp.elasticemail.com",
        Port: 2525,
        Username: "zishan.ahmed1210@gmail.com",
        Password: "DEC4ABE579F004A01E9CEE0E572AD6DB8F0E",
        To: email,
        From: "zishan.ahmed1210@gmail.com",
        Subject: "Verification Code",
        Body: "In order to register you e-mail please enter this code : " + verificationCode
      }
      window.Email.send(msg);
      setDisable(email && password ? true : false)
      setMessage('Thank you for registering: We have sent you a confirmation mail with 4 digit code')
    }
  }


  const submitCodeHandler = (e) => {
    e.preventDefault()
    if (Number(confirmCode) === verificationCode) {
      dispatch(register(name, email, password))
    } else { setMessage('Verification code not matched') }
  }


  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant='info'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='info' disabled={disable} >
          Register
        </Button>
      </Form>

      <br></br>

      <Form onSubmit={submitCodeHandler} >
        <Form.Group controlId='confirmCode'>
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            type='confirmcode'
            placeholder='Enter Confirmation Code'
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='info'>
          Submit Code
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
