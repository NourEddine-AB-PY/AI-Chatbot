const express = require('express');
const router = express.Router();

// GET /api/meta-config - get Meta App ID and Redirect URI for WhatsApp integration
router.get('/meta-config', async (req, res) => {
  try {
    const config = {
      appId: process.env.META_APP_ID || 'your_meta_app_id_here',
      redirectUri: process.env.META_REDIRECT_URI || 'http://localhost:5000/api/integrations/meta/callback'
    };
    
    res.json(config);
  } catch (error) {
    console.error('Error in meta-config endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/meta/callback - handle OAuth callback from Meta
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }
    
    // Here you would exchange the code for an access token
    // For now, we'll just return a success message
    res.json({ 
      success: true, 
      message: 'WhatsApp integration callback received',
      code: code,
      state: state 
    });
  } catch (error) {
    console.error('Error in meta callback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 