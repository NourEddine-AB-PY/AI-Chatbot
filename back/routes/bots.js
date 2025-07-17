const express = require('express')
const jwt = require('jsonwebtoken')
const { getBotsByUserId, createBot, updateBot, deleteBot, toggleBotStatus, updateBotSettings, getBotAnalytics, sendBotMessage } = require('../models/Bot')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// Get all bots for the logged-in user
router.get('/', async (req, res) => {
  const bots = await getBotsByUserId(req.user.id)
  res.json(bots)
})

// Create a new bot for the logged-in user
router.post('/', async (req, res) => {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })
  const bot = await createBot({ name, description, userId: req.user.id })
  if (!bot) return res.status(500).json({ error: 'Failed to create bot' })
  res.status(201).json(bot)
})

// Update a bot (only by owner)
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  const bot = await updateBot(id, req.user.id, { name, description })
  if (!bot) return res.status(404).json({ error: 'Bot not found' })
  res.json(bot)
})

// Delete a bot (only by owner)
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const success = await deleteBot(id, req.user.id)
  if (!success) return res.status(404).json({ error: 'Bot not found' })
  res.json({ success: true })
})

// Toggle bot status (active/inactive)
router.patch('/:id/toggle', async (req, res) => {
  const { id } = req.params
  const bot = await toggleBotStatus(id, req.user.id)
  if (!bot) return res.status(404).json({ error: 'Bot not found' })
  res.json(bot)
})

// Update bot settings/configuration
router.patch('/:id/settings', async (req, res) => {
  const { id } = req.params
  const { autoResponse, analytics, notifications, channels } = req.body
  const bot = await updateBotSettings(id, req.user.id, { autoResponse, analytics, notifications, channels })
  if (!bot) return res.status(404).json({ error: 'Bot not found' })
  res.json(bot)
})

// Get bot analytics
router.get('/:id/analytics', async (req, res) => {
  const { id } = req.params
  const analytics = await getBotAnalytics(id, req.user.id)
  if (!analytics) return res.status(404).json({ error: 'Bot not found' })
  res.json(analytics)
})

// Send message to bot (test chat)
router.post('/:id/chat', async (req, res) => {
  const { id } = req.params
  const { message } = req.body
  if (!message) return res.status(400).json({ error: 'Message is required' })
  
  const response = await sendBotMessage(id, req.user.id, message)
  if (!response) return res.status(404).json({ error: 'Bot not found' })
  res.json(response)
})

module.exports = router 