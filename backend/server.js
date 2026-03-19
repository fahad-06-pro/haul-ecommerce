const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()

const app = express()

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED ERROR:', err)
})

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api/categories', require('./routes/category'))
app.use('/api/products', require('./routes/product'))
app.use('/api/reviews', require('./routes/review'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/coupons', require('./routes/coupon'))
app.use('/api/orders', require('./routes/order'))
app.use('/api/payment', require('./routes/payment'))

app.get('/', (req, res) => {
  res.json({ message: 'Haul API is running!' })
})

connectDB()

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})