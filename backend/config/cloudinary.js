const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp']
    const ext = file.originalname.split('.').pop().toLowerCase()

    if (!allowedFormats.includes(ext)) {
      throw new Error(`Image format .${ext} not allowed. Use jpg, jpeg, png or webp only.`)
    }

    return {
      folder: 'haul-products',
      allowed_formats: allowedFormats,
    }
  },
})

const upload = multer({ storage })

module.exports = { cloudinary, upload }