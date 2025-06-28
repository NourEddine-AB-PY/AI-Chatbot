const express = require('express')
const axios = require('axios')
const router = express.Router()

// Facebook App credentials (set these in your .env)
const FB_APP_ID = process.env.FB_APP_ID
const FB_APP_SECRET = process.env.FB_APP_SECRET
const FB_REDIRECT_URI = process.env.FB_REDIRECT_URI || 'http://localhost:5000/api/integrations/facebook/callback'

// Step 1: Redirect user to Facebook OAuth
router.get('/facebook/start', (req, res) => {
  const state = Math.random().toString(36).substring(2) // You can use a better state generator
  const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(FB_REDIRECT_URI)}&state=${state}&scope=pages_messaging,pages_show_list,pages_manage_metadata,pages_read_engagement`;
  res.redirect(fbAuthUrl)
})

// Step 2: Handle Facebook OAuth callback
router.get('/facebook/callback', async (req, res) => {
  const { code } = req.query
  if (!code) return res.status(400).send('Missing code')
  try {
    // Exchange code for access token
    const tokenRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: {
        client_id: FB_APP_ID,
        redirect_uri: FB_REDIRECT_URI,
        client_secret: FB_APP_SECRET,
        code,
      },
    })
    const { access_token } = tokenRes.data
    // TODO: Use access_token to fetch pages, set up webhook, etc.
    res.send('Facebook connected! (access token received)')
  } catch (err) {
    console.error('Facebook OAuth error:', err.response?.data || err.message)
    res.status(500).send('Facebook OAuth failed')
  }
})

module.exports = router 