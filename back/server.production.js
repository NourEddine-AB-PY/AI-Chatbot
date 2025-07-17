require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const morgan = require('morgan')
const supabase = require('./supabaseClient')
const setupRouter = require('./routes/setup')

const app = express()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.supabase.co"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  // Create logs directory if it doesn't exist
  const logDir = path.dirname(process.env.LOG_FILE_PATH || '/var/log/chatbot/app.log')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  
  const accessLogStream = fs.createWriteStream(
    process.env.LOG_FILE_PATH || '/var/log/chatbot/app.log',
    { flags: 'a' }
  )
  app.use(morgan('combined', { stream: accessLogStream }))
} else {
  app.use(morgan('dev'))
}

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}
app.use(cors(corsOptions))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  })
})

// Metrics endpoint for monitoring
if (process.env.ENABLE_MONITORING === 'true') {
  app.get(process.env.METRICS_ENDPOINT || '/metrics', (req, res) => {
    const metrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString()
    }
    res.json(metrics)
  })
}

// Auth routes
const { router: authRouter, authenticateToken } = require('./routes/auth')
app.use('/api/auth', authRouter)

// Protected routes with authentication
app.use('/api/bots', authenticateToken, require('./routes/bots'))
app.use('/api/conversations', authenticateToken, require('./routes/conversations'))
app.use('/api/dashboard', authenticateToken, require('./routes/dashboard'))
app.use('/api/businesses', authenticateToken, require('./routes/businesses'))
app.use('/api/user-settings', authenticateToken, require('./routes/settings').router)
app.use('/api/integrations', authenticateToken, require('./routes/integrations'))
app.use('/api/integrations/meta', authenticateToken, require('./routes/meta'))
app.use('/api/admin', authenticateToken, require('./routes/admin'))

// Unprotected routes
app.use('/api', require('./routes/setup'))

// WhatsApp Webhook endpoints
app.get('/whatsapp/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge)
    } else {
      res.sendStatus(403)
    }
  } else {
    res.sendStatus(400)
  }
})

app.post('/whatsapp/webhook', async (req, res) => {
  try {
    const entry = req.body
    console.log('Received WhatsApp webhook:', JSON.stringify(entry, null, 2))

    const changes = entry.entry && entry.entry[0] && entry.entry[0].changes
    if (changes && changes[0].value && changes[0].value.messages) {
      const messageObj = changes[0].value.messages[0]
      const from = messageObj.from
      const text = messageObj.text && messageObj.text.body
      const wa_id = from
      const name = (changes[0].value.contacts && changes[0].value.contacts[0].profile.name) || ''

      // Call AI agent for response
      const aiResponse = await getAIResponse(text)
      const reply = aiResponse || 'Hello! This is an automated reply.'

      // Send reply via WhatsApp Cloud API
      await sendWhatsAppMessage(wa_id, reply)

      // Log conversation to Supabase
      const { data: integration } = await supabase
        .from('integrations')
        .select('*')
        .eq('phone_number', wa_id)
        .eq('type', 'whatsapp')
        .eq('status', 'active')
        .single()

      const business_id = integration ? integration.business_id : null
      const user_id = integration ? integration.user_id : null

      await supabase
        .from('conversations')
        .insert([{
          phone_number: wa_id,
          user_message: text,
          ai_response: reply,
          business_id: business_id,
          timestamp: new Date().toISOString()
        }])
    }

    res.status(200).send('EVENT_RECEIVED')
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// WhatsApp message sending function
async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('WhatsApp message sent successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message)
    throw error
  }
}

// AI response function
async function getAIResponse(message) {
  try {
    // This would typically call your AI service
    // For now, return a simple response
    return `Thank you for your message: "${message}". This is an automated response.`
  } catch (error) {
    console.error('Error getting AI response:', error)
    return 'I apologize, but I am unable to process your request at the moment.'
  }
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Production server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔒 Security features enabled`)
  console.log(`📊 Monitoring: ${process.env.ENABLE_MONITORING === 'true' ? 'Enabled' : 'Disabled'}`)
})

module.exports = app 