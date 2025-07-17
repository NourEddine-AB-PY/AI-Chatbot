const express = require('express')
const jwt = require('jsonwebtoken')
const { createSetup } = require('../models/Setup')
const router = express.Router()
const supabase = require('../supabaseClient')

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// Cookie-based authentication middleware
function authMiddleware(req, res, next) {
  console.log('🔍 Authenticating setup request');
  console.log('🔍 Cookies:', req.cookies);

  let token = req.cookies.authToken;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  console.log('🔍 Token found:', !!token);

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'Access denied - no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified for user:', decoded.email);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Register setup info for a user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      business_name,
      industry,
      business_description,
      business_availability,
      catalog_text,
      catalog_products,
      business_location,
      business_contact
    } = req.body;

    // Validate required fields
    if (!business_name || !industry || !business_description || !business_availability) {
      return res.status(400).json({
        error: 'Missing required fields: business_name, industry, business_description, and business_availability are required'
      });
    }

    // Check if user already has a business record
    const { data: existingBusiness, error: fetchError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Failed to check existing business' });
    }

    let result;
    if (existingBusiness) {
      // Update existing business record
      const { data, error } = await supabase
        .from('businesses')
        .update({
          business_name,
          industry,
          business_description,
          business_availability,
          catalog_text: catalog_text || null,
          catalog_products: catalog_products || null,
          business_location: business_location || null,
          business_contact: business_contact || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingBusiness.id)
        .select();

      if (error) {
        return res.status(500).json({ error: 'Failed to update business information' });
      }
      result = data[0];
    } else {
      // Create new business record
      const { data, error } = await supabase
        .from('businesses')
        .insert([
          {
            user_id: req.user.id,
            business_name,
            industry,
            business_description,
            business_availability,
            catalog_text: catalog_text || null,
            catalog_products: catalog_products || null,
            business_location: business_location || null,
            business_contact: business_contact || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to create business information' });
      }
      result = data;
    }

    res.status(201).json({
      success: true,
      business: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's business setup info
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', req.user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      return res.status(500).json({ error: 'Failed to fetch business information' })
    }

    res.json({ 
      success: true, 
      business: data || null 
    })
  } catch (error) {
    console.error('Get business error:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router 