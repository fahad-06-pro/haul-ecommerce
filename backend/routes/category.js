const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const protect = require('../middleware/auth')
const isAdmin = require('../middleware/admin')

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create category — Admin only
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { name, description, image } = req.body
    const slug = name.toLowerCase().replace(/ /g, '-')

    const existing = await Category.findOne({ slug })
    if (existing) return res.status(400).json({ message: 'Category already exists' })

    const category = await Category.create({ name, slug, description, image })
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update category — Admin only
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { name, description, image } = req.body
    const slug = name.toLowerCase().replace(/ /g, '-')

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, description, image },
      { new: true }
    )
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete category — Admin only
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router