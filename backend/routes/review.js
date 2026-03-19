const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const Product = require('../models/Product')
const protect = require('../middleware/auth')

// Get all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Add review
router.post('/:productId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body

    const existing = await Review.findOne({
      user: req.user.userId,
      product: req.params.productId,
    })
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' })

    const review = await Review.create({
      user: req.user.userId,
      product: req.params.productId,
      rating,
      comment,
    })

    // Update product ratings
    const reviews = await Review.find({ product: req.params.productId })
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

    await Product.findByIdAndUpdate(req.params.productId, {
      ratings: avgRating.toFixed(1),
      numReviews: reviews.length,
    })

    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete review
router.delete('/:reviewId', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
    if (!review) return res.status(404).json({ message: 'Review not found' })

    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await Review.findByIdAndDelete(req.params.reviewId)
    res.json({ message: 'Review deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router