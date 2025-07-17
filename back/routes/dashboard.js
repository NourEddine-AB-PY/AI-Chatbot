const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// REMOVE the local authMiddleware function and all its usages
// All routes should just be: router.get('/stats', async (req, res) => { ... })

router.get('/stats', async (req, res) => {
  try {
    // Get all businesses for this user
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', req.user.id);
    if (bizError) return res.status(500).json({ error: bizError.message });
    const businessIds = businesses?.map(b => b.id) || [];
    if (!businessIds.length) {
      return res.json({
        totalMessages: 0,
        satisfaction: null,
        channels: 0,
        weekly: [],
        recent: []
      });
    }

    // Fetch conversations for these businesses
    let conversations = [];
    if (businessIds.length) {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, timestamp, user_message, ai_response, phone_number, satisfaction_score, business_id')
        .in('business_id', businessIds)
        .order('timestamp', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      conversations = data || [];
    }

    // Calculate total messages
    const totalMessages = conversations.length;

    // Calculate average satisfaction
    let satisfaction = null;
    const scores = conversations.map(c => c.satisfaction_score).filter(s => typeof s === 'number');
    if (scores.length > 0) {
      satisfaction = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    // Calculate unique channels (from integrations)
    let channels = 0;
    if (businessIds.length) {
      const { data: integrations, error } = await supabase
        .from('integrations')
        .select('type')
        .in('business_id', businessIds);
      if (error) return res.status(500).json({ error: error.message });
      channels = new Set((integrations || []).map(i => i.type)).size;
    }

    // Weekly messages (last 7 days)
    const now = new Date();
    const weekly = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - i));
      const dayStr = day.toLocaleDateString('en-US', { weekday: 'short' });
      const count = conversations.filter(c => {
        const d = new Date(c.timestamp);
        return d.toDateString() === day.toDateString();
      }).length;
      return { name: dayStr, messages: count };
    });

    // Recent conversations (last 5)
    const recent = conversations.slice(0, 5).map(c => ({
      phone_number: c.phone_number,
      user_message: c.user_message,
      ai_response: c.ai_response,
      timestamp: c.timestamp
    }));

    res.json({
      totalMessages,
      satisfaction,
      channels,
      weekly,
      recent
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/activity', async (req, res) => {
  try {
    // Get all businesses for this user
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id, name, updated_at')
      .eq('user_id', req.user.id);
    if (bizError) return res.status(500).json({ error: bizError.message });
    const businessIds = businesses?.map(b => b.id) || [];
    console.log('businessIds:', businessIds);
    if (!businessIds.length) return res.json([]);

    // Fetch recent bots
    const { data: bots } = await supabase
      .from('bots')
      .select('name, createdat, business_id')
      .in('business_id', businessIds)
      .order('createdat', { ascending: false })
      .limit(5);
    console.log('bots:', bots);

    // Fetch recent integrations
    const { data: integrations } = await supabase
      .from('integrations')
      .select('type, created_at, business_id')
      .in('business_id', businessIds)
      .order('created_at', { ascending: false })
      .limit(5);
    console.log('integrations:', integrations);

    // Fetch recent conversations
    const { data: conversations } = await supabase
      .from('conversations')
      .select('phone_number, timestamp, business_id')
      .in('business_id', businessIds)
      .order('timestamp', { ascending: false })
      .limit(5);
    console.log('conversations:', conversations);

    // Fetch recent team members
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('user_id, invited_at, business_id')
      .in('business_id', businessIds)
      .order('invited_at', { ascending: false })
      .limit(5);
    console.log('teamMembers:', teamMembers);

    // Map all to a common format
    const activities = [
      ...(bots || []).map(b => ({
        type: 'bot',
        message: `Bot "${b.name}" created`,
        time: b.createdat
      })),
      ...(integrations || []).map(i => ({
        type: 'integration',
        message: `Channel "${i.type}" connected`,
        time: i.created_at
      })),
      ...(conversations || []).map(c => ({
        type: 'conversation',
        message: `Conversation started with ${c.phone_number}`,
        time: c.timestamp
      })),
      ...(teamMembers || []).map(t => ({
        type: 'team_member',
        message: `Team member invited: ${t.user_id}`,
        time: t.invited_at
      })),
    ];
    console.log('activities:', activities);

    // Sort all activities by time descending and take the top 10
    const sorted = activities
      .filter(a => a.time)
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);
    console.log('sorted:', sorted);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 