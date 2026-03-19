const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const protect = require('../middleware/auth')
const isAdmin = require('../middleware/admin')
const { upload } = require('../config/cloudinary')

// Get all products — search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, featured, page = 1, limit = 12 } = req.query

    const query = {}

    if (search) query.name = { $regex: search, $options: 'i' }
    if (category) query.category = category
    if (featured) query.featured = featured === 'true'
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const total = await Product.countDocuments(query)
    const products = await Product.find(query)
      .populate('category', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })

    res.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .populate('category', 'name')
      .limit(8)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get related products
router.get('/related/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    const related = await Product.find({
      category: product.category,
      _id: { $ne: req.params.id },
    }).limit(4)
    res.json(related)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name')
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create product — Admin only
router.post('/', protect, isAdmin, (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Image upload failed' })
    }
    next()
  })
}, async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, stock, featured, tags } = req.body
    const images = req.files ? req.files.map((file) => file.path) : []

    const product = await Product.create({
      name, description, price, discountPrice,
      category, stock, featured, tags,
      images,
    })
    res.status(201).json(product)
  } catch (error) {
    console.error('PRODUCT ERROR:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update product — Admin only
router.put('/:id', protect, isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const updates = req.body
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((file) => file.path)
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete product — Admin only
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router