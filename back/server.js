require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const supabase = require('./supabaseClient')
const setupRouter = require('./routes/setup')

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser()) // Parse cookies

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Test endpoint to verify static file serving
app.get('/test-static', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'uploads');
  
  if (fs.existsSync(uploadsPath)) {
    const files = fs.readdirSync(uploadsPath);
    res.json({
      message: 'Static file serving is configured',
      uploadsPath: uploadsPath,
      files: files,
      testUrl: files.length > 0 ? `/uploads/${files[0]}` : 'No files found'
    });
  } else {
    res.json({
      message: 'Uploads directory does not exist',
      uploadsPath: uploadsPath
    });
  }
});

// Test endpoint to serve a simple test image
app.get('/test-image', (req, res) => {
  // Create a simple SVG test image
  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="purple"/>
    <text x="50" y="50" text-anchor="middle" dy=".3em" fill="white" font-size="12">TEST</text>
  </svg>`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Auth routes
const { router: authRouter, authenticateToken } = require('./routes/auth')
app.use('/api/auth', authRouter)

// PROTECTED ROUTES WITH LOGGING
app.use('/api/bots', (req, res, next) => { console.log('Cookies for /api/bots:', req.cookies); next(); }, authenticateToken, require('./routes/bots'));
app.use('/api/conversations', (req, res, next) => { console.log('Cookies for /api/conversations:', req.cookies); next(); }, authenticateToken, require('./routes/conversations'));
app.use('/api/dashboard', (req, res, next) => { console.log('Cookies for /api/dashboard:', req.cookies); next(); }, authenticateToken, require('./routes/dashboard'));
app.use('/api/businesses', (req, res, next) => { console.log('Cookies for /api/businesses:', req.cookies); next(); }, authenticateToken, require('./routes/businesses'));
app.use('/api/user-settings', (req, res, next) => { console.log('Cookies for /api/user-settings:', req.cookies); next(); }, authenticateToken, require('./routes/settings').router);
app.use('/api/integrations', (req, res, next) => { console.log('Cookies for /api/integrations:', req.cookies); next(); }, authenticateToken, require('./routes/integrations'));
app.use('/api/integrations/meta', (req, res, next) => { console.log('Cookies for /api/integrations/meta:', req.cookies); next(); }, authenticateToken, require('./routes/meta'));
app.use('/api/admin', (req, res, next) => { console.log('Cookies for /api/admin:', req.cookies); next(); }, authenticateToken, require('./routes/admin'));

// UNPROTECTED META CONFIG ENDPOINT
app.use('/api/meta-config', require('./routes/meta'));

// UNPROTECTED
app.use('/api/setup', require('./routes/setup'));

// Test route
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// Messenger Webhook Verification
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'my_verify_token'; // Use the same token you set in Facebook
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Messenger Webhook Receiver
app.post('/webhook', (req, res) => {
  console.log('Webhook event:', JSON.stringify(req.body, null, 2));
  res.status(200).send('EVENT_RECEIVED');
});

// WhatsApp Webhook Verification Endpoint
app.get('/whatsapp/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('🔍 Webhook verification request:');
  console.log('Mode:', mode);
  console.log('Token:', token);
  console.log('Challenge:', challenge);
  console.log('Expected token:', VERIFY_TOKEN);

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verification successful');
      // Responds with the challenge token from the request
      res.status(200).send(challenge);
    } else {
      console.log('❌ Webhook verification failed - token mismatch');
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    console.log('❌ Webhook verification failed - missing parameters');
    res.sendStatus(400);
  }
});

// WhatsApp Webhook Receiver
app.post('/whatsapp/webhook', async (req, res) => {
  try {
    const logPath = path.join(__dirname, '../AI-agent/conversation_log.txt');
    const entry = req.body;
    console.log('Received WhatsApp webhook:', JSON.stringify(entry, null, 2));

    // Extract message info
    const changes = entry.entry && entry.entry[0] && entry.entry[0].changes;
    if (changes && changes[0].value && changes[0].value.messages) {
      const messageObj = changes[0].value.messages[0];
      const from = messageObj.from;
      const text = messageObj.text && messageObj.text.body;
      const wa_id = from;
      const name = (changes[0].value.contacts && changes[0].value.contacts[0].profile.name) || '';
      const logEntry = `WhatsApp Received from ${name} (${wa_id}): ${text}\n`;
      fs.appendFile(logPath, logEntry, err => {
        if (err) console.error('Failed to log message:', err);
      });

      // Call AI agent (Python) for a response
      const aiResponse = await getAIResponse(text);
      const reply = aiResponse || 'Hello! This is an automated reply.';

      // Log sent message
      const logReply = `WhatsApp Sent to ${name} (${wa_id}): ${reply}\n`;
      fs.appendFile(logPath, logReply, err => {
        if (err) console.error('Failed to log reply:', err);
      });

      // Send reply via WhatsApp Cloud API
      await sendWhatsAppMessage(wa_id, reply);

      // --- Log conversation to Supabase ---
      // Find the integration for this phone number
      const { data: integration, error: integrationError } = await supabase
        .from('integrations')
        .select('*')
        .eq('phone_number', wa_id)
        .eq('type', 'whatsapp')
        .eq('status', 'active')
        .single();
      let business_id = null;
      let user_id = null;
      if (integration) {
        business_id = integration.business_id;
        user_id = integration.user_id;
      }
      // Debug log before insert
      console.log('Logging conversation:', {
        phone_number: wa_id,
        user_message: text,
        ai_response: reply,
        business_id: business_id,
        timestamp: new Date().toISOString()
      });
      // Insert conversation
      const { error: convError } = await supabase
        .from('conversations')
        .insert([
          {
            phone_number: wa_id,
            user_message: text,
            ai_response: reply,
            business_id: business_id,
            timestamp: new Date().toISOString()
          }
        ]);
      if (convError) {
        console.error('Failed to log conversation to Supabase:', convError);
      }
      // --- End log conversation ---
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Error handling WhatsApp webhook:', err);
    res.sendStatus(500);
  }
});

// Helper: Send WhatsApp message via Cloud API
async function sendWhatsAppMessage(to, message) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

// Helper: Call AI agent (Python) via HTTP (assumes AI agent exposes an endpoint)
async function getAIResponse(message) {
  try {
    // Example: AI agent running on http://localhost:8000/ai-response
    const response = await axios.post('http://localhost:8000/ai-response', { message });
    return response.data.reply;
  } catch (err) {
    console.error('Failed to get AI response:', err);
    return null;
  }
}

// Add endpoint to provide Meta App ID and Redirect URI to frontend
app.get('/api/meta-config', (req, res) => {
  res.json({
    appId: process.env.META_APP_ID,
    redirectUri: process.env.META_REDIRECT_URI
  });
});

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 