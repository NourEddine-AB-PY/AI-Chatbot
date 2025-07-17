const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const supabase = require('../supabaseClient');
const router = express.Router();
const UAParser = require('ua-parser-js');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper: Create or update a user session (call this after login or token refresh)
async function createOrUpdateUserSession(req, userId) {
  try {
    const parser = new UAParser(req.headers['user-agent'] || '');
    const ua = parser.getResult();
    const deviceName = `${ua.browser.name || 'Unknown'} on ${ua.os.name || 'Unknown'}`;
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip || null;

    // Try to find an existing active session for this device+ip
    const { data: existing, error: selectError } = await supabase
      .from('user_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('device_name', deviceName)
      .eq('ip_address', ip)
      .eq('is_active', true)
      .limit(1);

    if (selectError) {
      console.error('Error checking existing session:', selectError);
      // If table doesn't exist, just return without error
      if (selectError.code === '42P01') { // Table doesn't exist
        return;
      }
      throw selectError;
    }

    if (existing && existing.length > 0) {
      // Update last_active
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({ last_active: new Date() })
        .eq('id', existing[0].id);
      
      if (updateError) {
        console.error('Error updating session:', updateError);
        throw updateError;
      }
    } else {
      // Insert new session
      const { error: insertError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          device_name: deviceName,
          ip_address: ip,
          user_agent: req.headers['user-agent'] || '',
          is_active: true,
          last_active: new Date(),
          created_at: new Date(),
        });
      
      if (insertError) {
        console.error('Error creating session:', insertError);
        // If table doesn't exist, just return without error
        if (insertError.code === '42P01') { // Table doesn't exist
          return;
        }
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Session tracking error:', error);
    // Don't throw - this is non-critical functionality
  }
}

// Simple test endpoint (no auth required)
router.get('/test', async (req, res) => {
  try {
    console.log('Testing user_settings table existence...');
    
    // Try to select from the table
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .limit(1);
    
    console.log('Test result:', { data, error });
    
    if (error) {
      return res.json({
        exists: false,
        error: error.message,
        code: error.code
      });
    }
    
    res.json({
      exists: true,
      message: 'Table exists and is accessible',
      sample_data: data
    });
  } catch (err) {
    console.error('Test error:', err);
    res.status(500).json({
      exists: false,
      error: err.message
    });
  }
});

// Test auth endpoint
router.get('/test-auth', async (req, res) => {
  // This endpoint is now protected by the global authenticateToken middleware
  // If it's reached here, it means the token is valid and the user is logged in.
  // We can return a success message and the user's ID if needed.
  const user = req.user; // req.user is set by authenticateToken middleware
  if (user) {
    res.json({
      success: true,
      message: 'Auth working',
      user: user
    });
  } else {
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Debug endpoint to check table structure
router.get('/debug', async (req, res) => {
  try {
    console.log('Checking user_settings table structure...');
    
    // Try to get all records for this user
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', req.user.id);
    
    console.log('user_settings data:', data);
    console.log('user_settings error:', error);
    
    // Try to get table info
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_settings')
      .select('*')
      .limit(1);
    
    console.log('Table info:', tableInfo);
    console.log('Table error:', tableError);
    
    res.json({
      user_id: req.user.id,
      user_settings_data: data,
      user_settings_error: error,
      table_info: tableInfo,
      table_error: tableError
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET user settings
router.get('/', async (req, res) => {
  const { id } = req.user;
  
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', id)
      .limit(1);

    if (error) {
      console.error('GET settings error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    // Return the settings or empty defaults
    const settings = data && data.length > 0 ? data[0] : {
      description: '',
      business_logo_url: '',
      language: 'en',
      phone: '',
      website: '',
      timezone: ''
    };
    
    res.json(settings);
  } catch (err) {
    console.error('GET settings server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT user settings
router.put('/', async (req, res) => {
  const { id } = req.user;
  const settings = req.body;
  
  try {
    // Check if user already has settings
    const { data: existing } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', id)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing settings
      const { error } = await supabase
        .from('user_settings')
        .update({
          business_name: settings.business_name || '',
          business_email: settings.business_email || '',
          business_logo_url: settings.business_logo_url || '',
          language: settings.language || 'en',
          phone: settings.phone || '',
          website: settings.website || '',
          timezone: settings.timezone || '',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', id);

      if (error) {
        console.error('Update error:', error);
        return res.status(500).json({ error: error.message });
      }
    } else {
      // Insert new settings
      const { error } = await supabase
        .from('user_settings')
        .insert({
          user_id: id,
          business_name: settings.business_name || '',
          business_email: settings.business_email || '',
          business_logo_url: settings.business_logo_url || '',
          language: settings.language || 'en',
          phone: settings.phone || '',
          website: settings.website || '',
          timezone: settings.timezone || '',
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Insert error:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    console.log('Settings saved for user:', id);
    res.json({ success: true, message: 'Settings saved successfully' });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload logo endpoint
router.post('/upload-logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { id } = req.user;
    // Use relative URL so it works with the frontend proxy
    const logoUrl = `/uploads/${req.file.filename}`;

    // Update user settings with the new logo URL
    const { data: existing } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', id)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing settings
      const { error } = await supabase
        .from('user_settings')
        .update({
          business_logo_url: logoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', id);

      if (error) {
        console.error('Update logo error:', error);
        return res.status(500).json({ error: error.message });
      }
    } else {
      // Insert new settings with logo
      const { error } = await supabase
        .from('user_settings')
        .insert({
          user_id: id,
          business_logo_url: logoUrl,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Insert logo error:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    console.log('Logo uploaded for user:', id, 'URL:', logoUrl);
    console.log('File details:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    res.json({ 
      success: true, 
      message: 'Logo uploaded successfully',
      logoUrl: logoUrl
    });

  } catch (err) {
    console.error('Logo upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint to check if uploaded files are accessible
router.get('/test-uploads', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../uploads');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      res.json({
        exists: true,
        files: files,
        uploadsDir: uploadsDir
      });
    } else {
      res.json({
        exists: false,
        message: 'Uploads directory does not exist'
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List active sessions for the current user
router.get('/sessions', async (req, res) => {
  const { id } = req.user;
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', id)
      .eq('is_active', true)
      .order('last_active', { ascending: false });
    
    if (error) {
      console.error('Error fetching sessions:', error);
      // If table doesn't exist, return empty array
      if (error.code === '42P01') {
        return res.json([]);
      }
      return res.status(500).json({ error: error.message });
    }
    res.json(data || []);
  } catch (err) {
    console.error('Sessions fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Terminate a session (logout from device)
router.delete('/sessions/:sessionId', async (req, res) => {
  const { id } = req.user;
  const { sessionId } = req.params;
  try {
    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId)
      .eq('user_id', id);
    
    if (error) {
      console.error('Error terminating session:', error);
      // If table doesn't exist, just return success
      if (error.code === '42P01') {
        return res.json({ success: true });
      }
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Terminate session error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = { router, createOrUpdateUserSession }; 