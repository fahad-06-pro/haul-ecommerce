const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  const authHeader = req.header('Authorization')

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' })
  }
}

module.exports = protect