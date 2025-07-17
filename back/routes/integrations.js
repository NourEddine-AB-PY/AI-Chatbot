const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const axios = require('axios'); // Added axios for API calls

// WhatsApp Integration Flow
router.get('/whatsapp/connect', async (req, res) => {
  try {
    // Get user ID from token (you'll need to implement JWT verification)
    const userId = req.user?.id || 'test_user'; // Replace with actual user ID
    
    // Check if user already has WhatsApp integrated
    const { data: existingIntegration } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'whatsapp')
      .single();
    
    if (existingIntegration && existingIntegration.status === 'active') {
      return res.json({
        success: true,
        alreadyConnected: true,
        integration: existingIntegration,
        message: 'WhatsApp already connected'
      });
    }
    
    // Start OAuth flow
    const META_APP_ID = process.env.META_APP_ID;
    const META_REDIRECT_URI = process.env.META_REDIRECT_URI;
    const state = Math.random().toString(36).substring(2);
    const scope = 'whatsapp_business_management,whatsapp_business_messaging,business_management';
    
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(META_REDIRECT_URI)}&state=${state}&scope=${scope}`;
    
    res.json({
      success: true,
      authUrl: authUrl,
      state: state,
      message: 'Redirect to Facebook OAuth'
    });
    
  } catch (error) {
    console.error('WhatsApp connect error:', error);
    res.status(500).json({ error: 'Failed to start WhatsApp integration' });
  }
});

// Handle OAuth callback and complete integration
router.get('/whatsapp/callback', async (req, res) => {
  const { code, state } = req.query;
  const userId = req.user?.id || 'test_user'; // Replace with actual user ID
  
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: {
        client_id: process.env.META_APP_ID,
        redirect_uri: process.env.META_REDIRECT_URI,
        client_secret: process.env.META_APP_SECRET,
        code: code,
      },
    });
    
    const { access_token } = tokenResponse.data;
    
    // Get user's WhatsApp Business accounts
    const businessAccountsResponse = await axios.get('https://graph.facebook.com/v19.0/me/businesses', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    // Get phone numbers for each business account
    const phoneNumbers = [];
    for (const business of businessAccountsResponse.data.data) {
      const phoneResponse = await axios.get(`https://graph.facebook.com/v19.0/${business.id}/owned_whatsapp_business_accounts`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      
      for (const waAccount of phoneResponse.data.data) {
        const numbersResponse = await axios.get(`https://graph.facebook.com/v19.0/${waAccount.id}/phone_numbers`, {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        });
        
        phoneNumbers.push(...numbersResponse.data.data.map(phone => ({
          ...phone,
          business_id: business.id,
          wa_account_id: waAccount.id
        })));
      }
    }
    
    // Save integration to database
    const integrationData = {
      user_id: userId,
      type: 'whatsapp',
      status: 'active',
      access_token: access_token,
      phone_numbers: phoneNumbers,
      business_account_id: phoneNumbers[0]?.wa_account_id,
      phone_number_id: phoneNumbers[0]?.id,
      phone_number: phoneNumbers[0]?.display_phone_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert or update integration
    const { data: integration, error } = await supabase
      .from('integrations')
      .upsert([integrationData], { onConflict: 'user_id,type' })
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to save integration' });
    }
    
    // Setup webhook for the first phone number
    if (phoneNumbers.length > 0) {
      try {
        const webhookUrl = `${process.env.BASE_URL}/whatsapp/webhook`;
        const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
        
        // Subscribe to webhook
        await axios.post(`https://graph.facebook.com/v19.0/${phoneNumbers[0].id}/subscribed_apps`, {
          access_token: access_token
        });
        
        // Set webhook URL
        await axios.post(`https://graph.facebook.com/v19.0/${phoneNumbers[0].id}/webhooks`, {
          object: 'whatsapp_business_account',
          callback_url: webhookUrl,
          verify_token: verifyToken,
          fields: ['messages', 'message_status', 'message_template_status']
        }, {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Webhook configured successfully');
      } catch (webhookError) {
        console.error('Webhook setup error:', webhookError);
      }
    }
    
    res.json({
      success: true,
      integration: integration,
      phoneNumbers: phoneNumbers,
      message: 'WhatsApp integration completed successfully! Your chatbot is now ready to respond to customer messages.'
    });
    
  } catch (error) {
    console.error('WhatsApp callback error:', error);
    res.status(500).json({ 
      error: 'WhatsApp integration failed',
      details: error.response?.data || error.message
    });
  }
});

// Get integration status
router.get('/whatsapp/status', async (req, res) => {
  try {
    const userId = req.user?.id || 'test_user'; // Replace with actual user ID
    
    const { data: integration, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'whatsapp')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    res.json({
      success: true,
      connected: !!integration && integration.status === 'active',
      integration: integration
    });
    
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Failed to get integration status' });
  }
});

// Disconnect WhatsApp
router.post('/whatsapp/disconnect', async (req, res) => {
  try {
    const userId = req.user?.id || 'test_user'; // Replace with actual user ID
    
    const { error } = await supabase
      .from('integrations')
      .update({ 
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('type', 'whatsapp');
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'WhatsApp disconnected successfully'
    });
    
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect WhatsApp' });
  }
});

module.exports = router; 