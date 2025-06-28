const express = require('express')
const jwt = require('jsonwebtoken')
const { createSetup } = require('../models/Setup')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// JWT authentication middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'No token' })
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Register setup info for a user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { businessName, industry, website, tone, specialties, businessHours } = req.body
    if (!businessName || !industry || !tone || !businessHours) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const setup = await createSetup({
      userId: req.user.id,
      businessName,
      industry,
      website,
      tone,
      specialties,
      businessHours,
    })
    res.status(201).json(setup)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router 