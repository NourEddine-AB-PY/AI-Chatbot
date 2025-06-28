const express = require('express')
const router = express.Router()
const supabase = require('../supabaseClient')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'No token' })
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Save conversation from AI agent
router.post('/', async (req, res) => {
  try {
    const { phone_number, user_message, ai_response, business_id } = req.body
    
    if (!phone_number || !user_message || !ai_response) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        phone_number,
        user_message,
        ai_response,
        business_id: business_id || null,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase conversation save error:', error)
      return res.status(500).json({ error: 'Failed to save conversation' })
    }

    res.status(201).json(data)
  } catch (err) {
    console.error('Conversation save error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get conversations for a business
router.get('/business/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('business_id', businessId)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Supabase conversation fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch conversations' })
    }

    res.json(data)
  } catch (err) {
    console.error('Conversation fetch error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get conversation stats (user-specific)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { data: conversations, error } = await require('../supabaseClient')
      .from('conversations')
      .select('phone_number');
    if (error) return res.status(500).json({ error: error.message });
    const totalConversations = conversations.length;
    const uniqueUsers = new Set(conversations.map(c => c.phone_number)).size;
    res.json({ totalConversations, totalUsers: uniqueUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all analytics data for the stats page (user-specific)
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    // 1. Get all businesses for this user
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', req.user.id);
    if (bizError) return res.status(500).json({ error: bizError.message });
    const businessIds = businesses.map(b => b.id);
    if (businessIds.length === 0) {
      return res.json({
        weeklyData: [],
        monthlyData: [],
        channelData: [],
        satisfaction: null,
        revenue: null
      });
    }
    // 2. Get all conversations for these businesses
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .in('business_id', businessIds);
    if (error) return res.status(500).json({ error: error.message });
    // 3. Aggregate weekly data (last 7 days)
    const now = new Date();
    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - i));
      const dayStr = day.toLocaleDateString('en-US', { weekday: 'short' });
      const dayConvos = conversations.filter(c => {
        const d = new Date(c.timestamp);
        return d.toDateString() === day.toDateString();
      });
      return {
        day: dayStr,
        conversations: dayConvos.length,
        users: new Set(dayConvos.map(c => c.phone_number)).size,
        satisfaction: null, // Placeholder, update if you have this field
        revenue: null // Placeholder, update if you have this field
      };
    });
    // 4. Aggregate monthly data (last 6 months)
    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthStr = month.toLocaleString('en-US', { month: 'short' });
      const monthConvos = conversations.filter(c => {
        const d = new Date(c.timestamp);
        return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
      });
      return {
        month: monthStr,
        conversations: monthConvos.length,
        users: new Set(monthConvos.map(c => c.phone_number)).size,
        satisfaction: null, // Placeholder
        revenue: null // Placeholder
      };
    });
    // 5. Channel distribution (if you store channel info)
    // Placeholder: you may need to adjust this if you have a channel field
    const channelData = [];
    // 6. Overall satisfaction and revenue (if available)
    const satisfaction = null; // Placeholder
    const revenue = null; // Placeholder
    res.json({ weeklyData, monthlyData, channelData, satisfaction, revenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conversations for the logged-in user, grouped by phone_number
router.get('/list', authMiddleware, async (req, res) => {
  try {
    // Get all businesses for this user
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', req.user.id);
    if (bizError) return res.status(500).json({ error: bizError.message });
    const businessIds = businesses.map(b => b.id);
    if (businessIds.length === 0) return res.json([]);
    // Get all conversations for these businesses
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .in('business_id', businessIds)
      .order('timestamp', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    // Group by phone_number, get last message and unread count
    const grouped = {};
    conversations.forEach(conv => {
      if (!grouped[conv.phone_number]) grouped[conv.phone_number] = [];
      grouped[conv.phone_number].push(conv);
    });
    const result = Object.entries(grouped).map(([phone, msgs], idx) => {
      const last = msgs[0];
      return {
        id: idx + 1,
        phone_number: phone,
        lastMessage: last.user_message || last.ai_response,
        time: last.timestamp,
        unread: 0, // Placeholder, implement unread logic if needed
        business_id: last.business_id
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages for a specific conversation (by businessId and phoneNumber)
router.get('/:businessId/:phoneNumber', authMiddleware, async (req, res) => {
  try {
    const { businessId, phoneNumber } = req.params;
    // Check if this business belongs to the user
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', businessId)
      .eq('user_id', req.user.id)
      .single();
    if (bizError || !business) return res.status(403).json({ error: 'Forbidden' });
    // Get all messages for this conversation
    const { data: messages, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('business_id', businessId)
      .eq('phone_number', phoneNumber)
      .order('timestamp', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update POST / to allow saving a single user message (and optionally a bot response)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { phone_number, user_message, ai_response, business_id } = req.body;
    if (!phone_number || !user_message || !business_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check if this business belongs to the user
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', business_id)
      .eq('user_id', req.user.id)
      .single();
    if (bizError || !business) return res.status(403).json({ error: 'Forbidden' });
    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        phone_number,
        user_message,
        ai_response: ai_response || null,
        business_id,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();
    if (error) {
      console.error('Supabase conversation save error:', error);
      return res.status(500).json({ error: 'Failed to save conversation' });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error('Conversation save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router 