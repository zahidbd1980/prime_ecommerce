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

const sslcz = new SslCommerzPayment(
  process.env.STORE_ID,
  process.env.STORE_PASSWORD,
  false)

app.get('/api/config/sslcommerzpay', async (req, res, next) => {

  const data = req.query;

  // sslcz.init(data).then((data) => {
  //   if (data?.GatewayPageURL) {
  //     return res.status(200).redirect(data?.GatewayPageURL)
  //   }
  // })

  sslcz.init(data)
    .then((data) => {
      return res.status(200).json({ GatewayPageURL: data?.GatewayPageURL });
    }).catch((error) => {
      return res.status(500).json({ message: error.message });
    });

})

// app.post('/ssl-pay-success', async (req, res, next) => {
//   return res.status(200).json({
//     data: {
//       "message": "success"
//     }
//   })
// })

// app.post('/ssl-pay-ipn', async (req, res, next) => {
//   return res.status(200).json({
//     data: req.body
//   })
// })

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
