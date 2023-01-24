import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listProductCategory } from '../actions/productActions'

const Category = () => {
  const dispatch = useDispatch()
  const categoryList = useSelector((state) => state.categoryList)
  const { loading, error, categories } = categoryList
  const catList = categories.map((item) => item.category)
  const productCategory = [...new Set(catList)]



  useEffect(() => {
    dispatch(listProductCategory())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (

    <Nav variant="pills" >
      {productCategory.map((p, i) => (<Nav.Item key={i}><LinkContainer to={'/' + p}>
        <Nav.Link>{p} </Nav.Link></LinkContainer>
      </Nav.Item>))}
    </Nav>)


}

export default Category
