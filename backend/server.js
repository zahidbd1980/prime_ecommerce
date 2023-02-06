import path from 'path'
import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

import { SslCommerzPayment } from 'sslcommerz'


dotenv.config()

connectDB()

const app = express()


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

app.get('/sslcommerzpay', async (req, res, next) => {
  // const data = {
  //   total_amount: 100,
  //   currency: 'BDT',
  //   tran_id: 'REF123',
  //   success_url: 'http://localhost:3030/success',
  //   fail_url: 'http://localhost:3030/fail',
  //   cancel_url: 'http://localhost:3030/cancel',
  //   ipn_url: 'http://localhost:3030/ipn',
  //   shipping_method: 'Courier',
  //   product_name: 'Computer.',
  //   product_category: 'Electronic',
  //   product_profile: 'general',
  //   cus_name: 'Customer Name',
  //   cus_email: 'customer@example.com',
  //   cus_add1: 'Dhaka',
  //   cus_add2: 'Dhaka',
  //   cus_city: 'Dhaka',
  //   cus_state: 'Dhaka',
  //   cus_postcode: '1000',
  //   cus_country: 'Bangladesh',
  //   cus_phone: '01711111111',
  //   cus_fax: '01711111111',
  //   ship_name: 'Customer Name',
  //   ship_add1: 'Dhaka',
  //   ship_add2: 'Dhaka',
  //   ship_city: 'Dhaka',
  //   ship_state: 'Dhaka',
  //   ship_postcode: 1000,
  //   ship_country: 'Bangladesh',
  // };

  const sslcz = new SslCommerzPayment(
    process.env.STORE_ID,
    process.env.STORE_PASSWORD,
    false)
  // sslcz.init(data).then((data) => {
  //   if (data?.GatewayPageURL) {
  //     return res.status(200).redirect(data?.GatewayPageURL)
  //   }
  // })

  const data = req.query;

  sslcz.init(data).then((data) => {
    if (data?.GatewayPageURL) {
      res.send(res.status(200).redirect(data?.GatewayPageURL))
    }
  })

})

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
