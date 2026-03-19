const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Order = require('../models/Order')
const protect = require('../middleware/auth')

// Create payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents mein convert
      currency: 'usd',
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Confirm payment
router.put('/confirm/:orderId', protect, async (req, res) => {
  try {
    const { stripePaymentId } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { paymentStatus: 'paid', stripePaymentId },
      { new: true }
    )

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router