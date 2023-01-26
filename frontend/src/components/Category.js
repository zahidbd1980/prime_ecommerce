import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProductCategory } from '../actions/productActions'

const Category = () => {
  const dispatch = useDispatch()
  const categoryList = useSelector((state) => state.categoryList)
  const { categories } = categoryList
  const catList = categories.map((item) => item.category)
  const productCategory = [...new Set(catList)]



  useEffect(() => {
    dispatch(listProductCategory())
  }, [dispatch])

  return (
    // <Nav variant="pills" >
    //   {productCategory.map((p, i) => (<Nav.Item key={i}><LinkContainer to={'/' + p}>
    //     <Nav.Link>{p} </Nav.Link></LinkContainer>
    //   </Nav.Item>))}
    // </Nav>

    <NavDropdown title="Categories" id="navbarScrollingDropdown">
      {productCategory.map((p, i) => (<NavDropdown.Item key={i} className='text-dark'><LinkContainer to={'/' + p}>
        <Nav.Link className='text-dark'>{p} </Nav.Link></LinkContainer>
      </NavDropdown.Item>))}
    </NavDropdown>
  )


}

export default Category
