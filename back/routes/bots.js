const express = require('express')
const jwt = require('jsonwebtoken')
const { getBotsByUserId, createBot, updateBot, deleteBot } = require('../models/Bot')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// Auth middleware
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

// Get all bots for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  const bots = await getBotsByUserId(req.user.id)
  res.json(bots)
})

// Create a new bot for the logged-in user
router.post('/', authMiddleware, async (req, res) => {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })
  const bot = await createBot({ name, description, userId: req.user.id })
  if (!bot) return res.status(500).json({ error: 'Failed to create bot' })
  res.status(201).json(bot)
})

// Update a bot (only by owner)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  const bot = await updateBot(id, req.user.id, { name, description })
  if (!bot) return res.status(404).json({ error: 'Bot not found' })
  res.json(bot)
})

// Delete a bot (only by owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  const success = await deleteBot(id, req.user.id)
  if (!success) return res.status(404).json({ error: 'Bot not found' })
  res.json({ success: true })
})

module.exports = router 