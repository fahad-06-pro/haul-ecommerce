const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const protect = require('../middleware/auth')
const isAdmin = require('../middleware/admin')
const sendEmail = require('../utils/email')

// Place order
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponDiscount } = req.body

    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
    }))

    const totalPrice = cart.totalPrice - (couponDiscount || 0)

    const order = await Order.create({
      user: req.user.userId,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
      couponDiscount: couponDiscount || 0,
    })

    // Update product sold count
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { sold: item.quantity, stock: -item.quantity },
      })
    }

    // Clear cart after order
    await Cart.findOneAndDelete({ user: req.user.userId })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get my orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price')
      .populate('user', 'name email')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all orders — Admin only
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update order status — Admin only
router.put('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate('user', 'name email')

    // Email notification
    await sendEmail(
      order.user.email,
      `Order Update — Haul`,
      `<h2>Hi ${order.user.name},</h2>
       <p>Your order <strong>#${order._id}</strong> status has been updated to: <strong>${orderStatus}</strong></p>
       <p>Thank you for shopping with Haul!</p>`
    )

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router