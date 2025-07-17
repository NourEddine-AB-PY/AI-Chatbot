const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/businesses - list all businesses
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('businesses').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/businesses/my-business - get current user's business
router.get('/my-business', async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      return res.status(500).json({ error: 'Failed to fetch business information' });
    }

    res.json({ 
      success: true, 
      business: data || null 
    });

  } catch (error) {
    console.error('Error in my-business endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/businesses/business-info - get current user's business info
router.get('/business-info', async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Failed to fetch business information' });
    }

    res.json({
      success: true,
      business: data || null
    });
  } catch (error) {
    console.error('Error in GET /business-info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/businesses/business-info - save business information from integration page
router.post('/business-info', async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    const userId = req.user.id;
    
    const { description, catalog_text, catalog_products, business_availability, business_location, business_contact } = req.body;
    
    // Validate required fields
    if (!description || !catalog_text || !business_availability || !business_location || !business_contact) {
      return res.status(400).json({ 
        error: 'All business information fields are required' 
      });
    }

    // First, check if user already has a business record
    const { data: existingBusiness, error: fetchError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      return res.status(500).json({ error: 'Failed to check existing business' });
    }

    let result;
    if (existingBusiness) {
      // Update existing business
      const { data, error } = await supabase
        .from('businesses')
        .update({
          business_description: description,
          catalog_text: catalog_text,
          catalog_products: catalog_products || null,
          business_availability: business_availability,
          business_location: business_location,
          business_contact: business_contact,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingBusiness.id)
        .select();

      if (error) {
        console.error('Error updating business:', error);
        return res.status(500).json({ error: 'Failed to update business information' });
      }
      result = data[0];
    } else {
      // Create new business record
      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          user_id: userId,
          business_description: description,
          catalog_text: catalog_text,
          catalog_products: catalog_products || null,
          business_availability: business_availability,
          business_location: business_location,
          business_contact: business_contact,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error creating business:', error);
        return res.status(500).json({ error: 'Failed to create business information' });
      }
      result = data[0];
    }

    res.json({ 
      success: true, 
      message: 'Business information saved successfully',
      business: result 
    });

  } catch (error) {
    console.error('Error in business-info endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 