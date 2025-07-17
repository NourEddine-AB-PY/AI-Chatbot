const supabase = require('../supabaseClient')

// Helper functions for bot operations
async function getBotsByUserId(userId) {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('userid', userId)
  if (error) return []
  
  console.log('Raw bots data:', data)
  
  // Add analytics data to each bot
  const botsWithAnalytics = await Promise.all(data.map(async (bot) => {
    // Get conversation stats for this bot using business_id
    let conversations = []
    const { data: conversationsData, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('business_id', bot.business_id)
    
    console.log(`Conversations for bot ${bot.id} (business_id: ${bot.business_id}):`, conversationsData)
    
    if (!convError && conversationsData) {
      conversations = conversationsData
    }
    
    // Calculate analytics
    const totalMessages = conversations.length // Each conversation is one message
    const totalConversations = conversations.length
    
    // Calculate accuracy (mock data for now - could be based on satisfaction scores)
    const accuracy = Math.floor(Math.random() * 30) + 70 // 70-100%
    
    const botWithAnalytics = {
      ...bot,
      messages: totalMessages,
      accuracy: accuracy
    }
    
    console.log(`Bot ${bot.id} with analytics:`, botWithAnalytics)
    
    return botWithAnalytics
  }))
  
  console.log('Final bots with analytics:', botsWithAnalytics)
  return botsWithAnalytics
}

async function createBot({ name, description, userId }) {
  console.log('Attempting to create bot:', { name, description, userId });
  const { data, error } = await supabase
    .from('bots')
    .insert([{ name, description, userid: userId }])
    .select()
    .single()
  if (error) {
    console.error('Supabase createBot error:', error)
    return null
  }
  return data
}

async function updateBot(id, userId, { name, description }) {
  const { data, error } = await supabase
    .from('bots')
    .update({ name, description })
    .eq('id', id)
    .eq('userid', userId)
    .select()
    .single()
  if (error) return null
  return data
}

async function deleteBot(id, userId) {
  const { error } = await supabase
    .from('bots')
    .delete()
    .eq('id', id)
    .eq('userid', userId)
  return !error
}

async function toggleBotStatus(id, userId) {
  // First get current status
  const { data: currentBot, error: fetchError } = await supabase
    .from('bots')
    .select('status')
    .eq('id', id)
    .eq('userid', userId)
    .single()
  
  if (fetchError || !currentBot) return null
  
  // Toggle status
  const newStatus = currentBot.status === 'active' ? 'inactive' : 'active'
  const { data, error } = await supabase
    .from('bots')
    .update({ status: newStatus })
    .eq('id', id)
    .eq('userid', userId)
    .select()
    .single()
  
  if (error) return null
  return data
}

async function updateBotSettings(id, userId, { autoResponse, analytics, notifications, channels }) {
  const updateData = {}
  if (autoResponse !== undefined) updateData.auto_response = autoResponse
  if (analytics !== undefined) updateData.analytics_enabled = analytics
  if (notifications !== undefined) updateData.notifications_enabled = notifications
  if (channels !== undefined) updateData.channels = channels
  
  const { data, error } = await supabase
    .from('bots')
    .update(updateData)
    .eq('id', id)
    .eq('userid', userId)
    .select()
    .single()
  
  if (error) return null
  return data
}

async function getBotAnalytics(id, userId) {
  // Get bot info
  const { data: bot, error: botError } = await supabase
    .from('bots')
    .select('*')
    .eq('id', id)
    .eq('userid', userId)
    .single()
  
  if (botError || !bot) return null
  
  // Get conversation stats for this bot using business_id
  let conversations = []
  const { data: conversationsData, error: convError } = await supabase
    .from('conversations')
    .select('*')
    .eq('business_id', bot.business_id)
  
  if (convError) conversations = []
  else conversations = conversationsData
  
  // Calculate analytics
  const totalMessages = conversations.length // Each conversation is one message
  const totalConversations = conversations.length
  const avgMessagesPerConversation = totalConversations > 0 ? (totalMessages / totalConversations).toFixed(1) : 0
  
  // Calculate accuracy (mock data for now)
  const accuracy = Math.floor(Math.random() * 30) + 70 // 70-100%
  
  return {
    botId: id,
    totalMessages,
    totalConversations,
    avgMessagesPerConversation,
    accuracy,
    status: bot.status,
    createdAt: bot.created_at
  }
}

async function sendBotMessage(id, userId, message) {
  // Verify bot exists and belongs to user
  const { data: bot, error: botError } = await supabase
    .from('bots')
    .select('*')
    .eq('id', id)
    .eq('userid', userId)
    .single()
  
  if (botError || !bot) return null
  
  // Create a new conversation or get existing one
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert([{
      phone_number: 'test-user',
      user_message: message,
      ai_response: 'Bot response placeholder',
      business_id: bot.business_id,
      timestamp: new Date().toISOString()
    }])
    .select()
    .single()
  
  if (convError) return null
  
  // Generate bot response (mock for now)
  const responses = [
    "Hello! I'm here to help you. How can I assist you today?",
    "Thanks for your message! I understand you're asking about that. Let me help you with that.",
    "I see what you're looking for. Here's what I can tell you about that topic.",
    "Great question! Based on my knowledge, here's what I found for you.",
    "I'm processing your request. Here's the information you need."
  ]
  
  const botResponse = responses[Math.floor(Math.random() * responses.length)]
  
  return {
    conversationId: conversation.id,
    userMessage: message,
    botResponse,
    timestamp: new Date().toISOString()
  }
}

module.exports = { 
  getBotsByUserId, 
  createBot, 
  updateBot, 
  deleteBot, 
  toggleBotStatus, 
  updateBotSettings, 
  getBotAnalytics, 
  sendBotMessage 
} 