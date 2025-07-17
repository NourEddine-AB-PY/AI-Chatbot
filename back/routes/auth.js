const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { findUserByEmail, createUser } = require('../models/User')
const { createOrUpdateUserSession } = require('./settings'); // Import the helper

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
    console.log('User object after creation:', user);
    if (!user) return res.status(500).json({ error: 'Failed to create user' })
    
    // Skip user_settings insertion for now to avoid RLS issues
    console.log('User created successfully, skipping user_settings for now');
    // No business_setups table exists, so we skip this
    const setup = null;
    
    // ✅ SECURE: Create JWT token with shorter expiration
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' } // Reduced from 7d to 24h for security
    )
    
    // ✅ SECURE: Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // for local dev
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
      // domain property removed for local dev
    })
    
    res.status(201).json({ 
      success: true,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        business_setup_id: setup?.id || null 
      } 
    })
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Server error', details: err.message || err.toString() })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔍 Login attempt:', { email: req.body.email, hasPassword: !!req.body.password })
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    
    console.log('🔍 Looking up user:', email)
    const user = await findUserByEmail(email)
    if (!user) {
      console.log('❌ User not found:', email)
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    console.log('🔍 User found, checking password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      console.log('❌ Password mismatch for user:', email)
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    console.log('✅ Password match, proceeding with login')
    // No business_setups table exists, so we skip this
    const setup = null;
    // Track session/device info
    await createOrUpdateUserSession(req, user.id);
    
    // ✅ SECURE: Create JWT token with shorter expiration
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' } // Reduced from 7d to 24h for security
    )
    
    // ✅ SECURE: Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // for local dev
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
      // domain property removed for local dev
    })
    
    const responseData = { 
      success: true,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        business_setup_id: setup?.id || null 
      } 
    }
    
    console.log('✅ Login successful, sending response:', responseData)
    res.json(responseData)
  } catch (err) {
    console.error('❌ Login error:', err); // Log the full error to the server console
    res.status(500).json({ error: 'Server error', details: err.message || err.toString() }) // Send error details for debugging
  }
})

// ✅ SECURE: Logout endpoint
router.post('/logout', (req, res) => {
  // Clear the HTTP-only cookie
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
    // no domain
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// ✅ SECURE: Authentication middleware
const authenticateToken = (req, res, next) => {
  console.log('🔍 Authenticating request to:', req.path);
  console.log('🔍 Cookies:', req.cookies);

  let token = req.cookies.authToken;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  console.log('🔍 Token found:', !!token);

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'Access denied - no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified for user:', decoded.email);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ✅ SECURE: Check authentication status
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await findUserByEmail(req.user.email)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // No business_setups table exists, so we skip this
    const setup = null;
    
    res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        business_setup_id: setup?.id || null 
      } 
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = { router, authenticateToken } 