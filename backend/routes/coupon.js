const express = require('express')
const router = express.Router()
const Coupon = require('../models/Coupon')
const protect = require('../middleware/auth')
const isAdmin = require('../middleware/admin')

// Apply coupon
router.post('/apply', protect, async (req, res) => {
  try {
    const { code, orderAmount } = req.body

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' })
    if (!coupon.isActive) return res.status(400).json({ message: 'Coupon is inactive' })
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon usage limit reached' })
    if (new Date() > coupon.expiresAt) return res.status(400).json({ message: 'Coupon has expired' })
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order amount is $${coupon.minOrderAmount}` })
    }

    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * coupon.discountValue) / 100
    } else {
      discount = coupon.discountValue
    }

    res.json({ discount, message: 'Coupon applied successfully!' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create coupon — Admin only
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body)
    res.status(201).json(coupon)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all coupons — Admin only
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.find()
    res.json(coupons)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete coupon — Admin only
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id)
    res.json({ message: 'Coupon deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router