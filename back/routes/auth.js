const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { findUserByEmail, createUser } = require('../models/User')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const existing = await findUserByEmail(email)
    if (existing) return res.status(400).json({ error: 'Email already in use' })
    const hash = await bcrypt.hash(password, 10)
    const user = await createUser({ name, email, password: hash })
    if (!user) return res.status(500).json({ error: 'Failed to create user' })
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const user = await findUserByEmail(email)
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router 