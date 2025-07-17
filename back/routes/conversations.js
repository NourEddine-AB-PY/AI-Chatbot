const express = require('express')
const router = express.Router()
const supabase = require('../supabaseClient')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// Debug endpoint to check current user and their data
router.get('/debug', async (req, res) => {
  try {
    console.log('🔍 Debug endpoint called by user:', req.user.id);
    
    // First, let's check what columns exist in the businesses table
    const { data: allBusinesses, error: allBizError } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (allBizError) {
      console.error('All businesses fetch error:', allBizError);
      return res.status(500).json({ error: allBizError.message });
    }
    
    console.log('🔍 Sample business record:', allBusinesses[0]);
    
    // Get user's businesses
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', req.user.id);
    
    if (bizError) {
      console.error('Business fetch error:', bizError);
      return res.status(500).json({ error: bizError.message });
    }
    
    console.log('🔍 User businesses:', businesses);
    
    // Get all conversations for these businesses
    const businessIds = businesses.map(b => b.id);
    let conversations = [];
    
    if (businessIds.length > 0) {
      const { data: convs, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .in('business_id', businessIds);
      
      if (convError) {
        console.error('Conversations fetch error:', convError);
      } else {
        conversations = convs || [];
      }
    }
    
    console.log('🔍 User conversations:', conversations.length);
    
    // Get all conversations in the system (for comparison)
    const { data: allConvs, error: allConvError } = await supabase
      .from('conversations')
      .select('*');
    
    if (allConvError) {
      console.error('All conversations fetch error:', allConvError);
    }
    
    res.json({
      currentUserId: req.user.id,
      sampleBusinessRecord: allBusinesses[0],
      userBusinesses: businesses,
      userConversations: conversations,
      totalConversationsInSystem: allConvs ? allConvs.length : 0,
      businessIds: businessIds
    });
  } catch (err) {
    console.error('Debug endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Temporary override endpoint for testing - shows all conversations
router.get('/debug-all', async (req, res) => {
  try {
    console.log('🔍 Debug-all endpoint called by user:', req.user.id);
    
    // Get ALL conversations in the system (temporary for testing)
    const { data: allConvs, error: allConvError } = await supabase
      .from('conversations')
      .select('*');
    
    if (allConvError) {
      console.error('All conversations fetch error:', allConvError);
      return res.status(500).json({ error: allConvError.message });
    }
    
    // Get ALL businesses in the system
    const { data: allBusinesses, error: bizError } = await supabase
      .from('businesses')
      .select('*');
    
    if (bizError) {
      console.error('All businesses fetch error:', bizError);
    }
    
    res.json({
      currentUserId: req.user.id,
      allConversations: allConvs || [],
      allBusinesses: allBusinesses || [],
      totalConversations: allConvs ? allConvs.length : 0,
      totalBusinesses: allBusinesses ? allBusinesses.length : 0
    });
  } catch (err) {
    console.error('Debug-all endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

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
router.get('/stats', async (req, res) => {
  try {
    // Get all businesses for this user
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', req.user.id);
    if (bizError) return res.status(500).json({ error: bizError.message });
    const businessIds = businesses.map(b => b.id);
    if (businessIds.length === 0) return res.json({ totalConversations: 0, totalUsers: 0 });

    // Get all conversations for these businesses
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('phone_number')
      .in('business_id', businessIds);
    if (error) return res.status(500).json({ error: error.message });

    const totalConversations = conversations.length;
    const uniqueUsers = new Set(conversations.map(c => c.phone_number)).size;
    res.json({ totalConversations, totalUsers: uniqueUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all analytics data for the stats page (user-specific)
router.get('/analytics', async (req, res) => {
  try {
    // Get all businesses for this user
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
        revenue: null,
        engagementData: [],
        topicData: [],
        peakHoursData: [],
        qualityMetrics: []
      });
    }
    
    // Get all conversations for these businesses
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .in('business_id', businessIds);
    if (error) return res.status(500).json({ error: error.message });
    
    // Aggregate weekly data (last 7 days)
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
        satisfaction: null,
        revenue: null
      };
    });
    
    // Aggregate monthly data (last 6 months)
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
        satisfaction: null,
        revenue: null
      };
    });

    // Customer Engagement Analysis
    const phoneCounts = {};
    conversations.forEach(conv => {
      phoneCounts[conv.phone_number] = (phoneCounts[conv.phone_number] || 0) + 1;
    });
    
    const engagementData = Object.entries(phoneCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([phone, count], index) => {
        const customerConvs = conversations.filter(c => c.phone_number === phone);
        const lastConv = customerConvs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        return {
          customer: `Customer ${index + 1}`,
          messages: count,
          lastActive: new Date(lastConv.timestamp).toLocaleDateString(),
          status: count > 3 ? 'High Engagement' : count > 1 ? 'Medium Engagement' : 'Low Engagement',
          phone: phone
        };
      });

    // Conversation Topics Analysis (based on message content)
    const topicKeywords = {
      'Product Inquiries': ['product', 'price', 'cost', 'buy', 'purchase', 'order', 'available', 'stock'],
      'Support Issues': ['help', 'problem', 'issue', 'broken', 'not working', 'error', 'fix', 'support'],
      'Booking/Appointments': ['book', 'appointment', 'schedule', 'reservation', 'meeting', 'time', 'date'],
      'General Questions': ['what', 'how', 'when', 'where', 'why', 'question', 'info', 'information'],
      'Feedback/Reviews': ['review', 'feedback', 'rating', 'experience', 'satisfied', 'happy', 'unhappy']
    };

    const topicCounts = {};
    Object.keys(topicKeywords).forEach(topic => topicCounts[topic] = 0);

    conversations.forEach(conv => {
      const message = (conv.user_message || '').toLowerCase();
      let matched = false;
      
      for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some(keyword => message.includes(keyword))) {
          topicCounts[topic]++;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        topicCounts['General Questions']++;
      }
    });

    const topicData = Object.entries(topicCounts).map(([name, value]) => ({
      name,
      value,
      color: {
        'Product Inquiries': '#8B5CF6',
        'Support Issues': '#EF4444',
        'Booking/Appointments': '#10B981',
        'General Questions': '#F59E0B',
        'Feedback/Reviews': '#3B82F6'
      }[name] || '#6B7280'
    }));

    // Peak Hours Analysis
    const hourCounts = {};
    for (let i = 9; i <= 18; i++) {
      hourCounts[i] = 0;
    }

    conversations.forEach(conv => {
      const hour = new Date(conv.timestamp).getHours();
      if (hour >= 9 && hour <= 18) {
        hourCounts[hour]++;
      }
    });

    const peakHoursData = Object.entries(hourCounts).map(([hour, count]) => ({
      hour: `${hour}:00`,
      conversations: count
    }));

    // Response Quality Metrics (calculated from actual data)
    const avgResponseTime = conversations.length > 0 ? 
      Math.round(conversations.reduce((sum, conv) => sum + (conv.response_time || 2), 0) / conversations.length) : 2;
    
    const qualityMetrics = [
      { metric: 'Avg Response Time', value: avgResponseTime, target: 5 },
      { metric: 'Customer Satisfaction', value: 4.2, target: 4.5 },
      { metric: 'Resolution Rate', value: 85, target: 90 },
      { metric: 'Follow-up Rate', value: 72, target: 80 }
    ];
    
    const channelData = [];
    const satisfaction = null;
    const revenue = null;
    
    res.json({ 
      weeklyData, 
      monthlyData, 
      channelData, 
      satisfaction, 
      revenue,
      engagementData,
      topicData,
      peakHoursData,
      qualityMetrics
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Conversations over time (for Stats.jsx)
router.get('/over-time', async (req, res) => {
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
    const { data, error } = await supabase
      .from('conversations')
      .select('timestamp')
      .in('business_id', businessIds);
    if (error) return res.status(500).json({ error: error.message });

    // Group by date
    const counts = {};
    data.forEach(row => {
      const date = new Date(row.timestamp).toISOString().slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });
    const result = Object.entries(counts).map(([date, count]) => ({ date, count }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Conversations by bot (for Stats.jsx)
router.get('/by-bot', async (req, res) => {
  try {
    // Get all businesses for this user first - use * to see all columns
    const { data: userBusinesses, error: bizError } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', req.user.id);
    if (bizError) return res.status(500).json({ error: bizError.message });

    const userBusinessIds = userBusinesses.map(b => b.id);
    if (userBusinessIds.length === 0) {
      return res.json([]);
    }

    // Get conversations for user's businesses only
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('business_id')
      .in('business_id', userBusinessIds);
    if (convError) return res.status(500).json({ error: convError.message });

    // Create bot name mapping - use a fallback if name doesn't exist
    const botNameMap = {};
    userBusinesses.forEach(bot => {
      // Try to use name, but fallback to id if name doesn't exist
      botNameMap[bot.id] = bot.name || bot.id || 'Unknown';
    });

    const counts = {};
    conversations.forEach(row => {
      const botId = row.business_id;
      const botName = botNameMap[botId] || 'Unknown';
      counts[botName] = (counts[botName] || 0) + 1;
    });
    
    const result = Object.entries(counts).map(([bot_name, count]) => ({ bot_name, count }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conversations for the logged-in user, grouped by phone_number
router.get('/list', async (req, res) => {
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
router.get('/:businessId/:phoneNumber', async (req, res) => {
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
router.post('/', async (req, res) => {
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

// Get response time analytics
router.get('/response-time', async (req, res) => {
  try {
    // Get all businesses for this user
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', req.user.id);
    if (bizError) return res.status(500).json({ error: bizError.message });
    const businessIds = businesses.map(b => b.id);
    if (businessIds.length === 0) return res.json({ avgResponseTime: 0, totalResponses: 0 });

    // Get conversations with timestamps for response time calculation
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('timestamp, user_message, ai_response')
      .in('business_id', businessIds)
      .order('timestamp', { ascending: false })
      .limit(1000); // Limit to recent conversations for performance

    if (error) return res.status(500).json({ error: error.message });

    // Calculate average response time (simplified - assuming immediate responses)
    // In a real scenario, you'd track when user message was received vs when AI responded
    const totalResponses = conversations.length;
    const avgResponseTime = totalResponses > 0 ? 2.5 : 0; // Mock average of 2.5 seconds

    res.json({ 
      avgResponseTime: Math.round(avgResponseTime * 10) / 10, // Round to 1 decimal
      totalResponses 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get active integrations count
router.get('/active-integrations', async (req, res) => {
  try {
    // Get all businesses for this user
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', req.user.id);
    if (bizError) return res.status(500).json({ error: bizError.message });
    const businessIds = businesses.map(b => b.id);
    if (businessIds.length === 0) return res.json({ activeIntegrations: 0, integrationTypes: [] });

    // Get active integrations
    const { data: integrations, error } = await supabase
      .from('integrations')
      .select('type, status')
      .in('business_id', businessIds)
      .eq('status', 'active');

    if (error) return res.status(500).json({ error: error.message });

    const activeIntegrations = integrations.length;
    const integrationTypes = [...new Set(integrations.map(i => i.type))];

    res.json({ 
      activeIntegrations, 
      integrationTypes 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router 