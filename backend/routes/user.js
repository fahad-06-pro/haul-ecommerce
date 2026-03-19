const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const protect = require('../middleware/auth')

// Get profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, address, avatar },
      { new: true }
    ).select('-password')

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Change password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.userId)

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get wishlist
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('wishlist')
    res.json(user.wishlist)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Add to wishlist
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)

    if (user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' })
    }

    user.wishlist.push(req.params.productId)
    await user.save()

    res.json({ message: 'Added to wishlist' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Remove from wishlist
router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    )
    await user.save()

    res.json({ message: 'Removed from wishlist' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router