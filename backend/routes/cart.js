const express = require('express')
const router = express.Router()
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const protect = require('../middleware/auth')

// Get cart — deleted products filter karo
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product', 'name images price stock')

    if (!cart) return res.json({ items: [], totalPrice: 0 })

    // Deleted products remove karo
    cart.items = cart.items.filter((item) => item.product !== null)
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Add to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' })

    let cart = await Cart.findOne({ user: req.user.userId })

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [], totalPrice: 0 })
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product: productId, quantity, price: product.price })
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update cart item quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const cart = await Cart.findOne({ user: req.user.userId })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    const item = cart.items.find((item) => item.product.toString() === productId)
    if (!item) return res.status(404).json({ message: 'Item not found in cart' })

    item.quantity = quantity

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Remove item from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId)
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.userId })
    res.json({ message: 'Cart cleared' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router