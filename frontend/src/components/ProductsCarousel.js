import React from 'react'
import { useSelector } from 'react-redux'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import Product from './Product'

const ProductsCarousel = () => {

    const productList = useSelector((state) => state.productList)
    const { products } = productList

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1
        }
    }

    return (
        <>
            <h2>You May Also Like</h2>
            <Carousel
                responsive={responsive}
            >
                {products.map((product) => (
                    <div className='mx-2' key={product._id}>
                        <Product product={product} />
                    </div>
                ))}
            </Carousel>
        </>
    )
}

export default ProductsCarousel