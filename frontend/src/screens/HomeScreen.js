import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1
  const categoryName = match.params.categoryName

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)

  const { error, products, page, pages } = productList

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber, categoryName))
  }, [dispatch, keyword, pageNumber, categoryName])

  return (
    <>
      <Meta />
      {!keyword && !categoryName ? (
        <>
          <ProductCarousel />
          <h1>Latest Products</h1>
        </>

      ) : (
        <Link to='/' className='btn btn-light'>
          Go Back
        </Link>
      )}
      {error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={6} md={4} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
            categoryname={categoryName ? categoryName : ''}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
