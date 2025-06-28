require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Middleware
app.use(cors())
app.use(express.json())

// Auth routes
app.use('/api/auth', require('./routes/auth'))
// Bots routes
app.use('/api/bots', require('./routes/bots'))
// Conversations routes
app.use('/api/conversations', require('./routes/conversations'))
// Setup routes
app.use('/api/setup', require('./routes/setup'))
// Integrations routes
app.use('/api/integrations', require('./routes/integrations'))

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

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 