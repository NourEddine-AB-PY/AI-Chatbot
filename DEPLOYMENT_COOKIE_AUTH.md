# 🚀 Deployment Guide - Cookie-Based Authentication

## ✅ Authentication System Overview

Your ChatBot Platform now uses **secure HTTP-only cookies** for authentication instead of localStorage tokens. This makes it production-ready and secure for deployment.

### 🔐 How Cookie Authentication Works

1. **Login/Signup**: User credentials are sent to `/api/auth/login` or `/api/auth/signup`
2. **Server Response**: Backend sets an HTTP-only cookie with JWT token
3. **Automatic Authentication**: All subsequent API calls include the cookie automatically
4. **Logout**: Backend clears the cookie when user logs out

### 🛡️ Security Benefits

- ✅ **XSS Protection**: HTTP-only cookies cannot be accessed by JavaScript
- ✅ **CSRF Protection**: Cookies are automatically sent with requests
- ✅ **Automatic Expiry**: Server controls token lifetime
- ✅ **Secure by Default**: No client-side token storage

## 🌐 Environment Configuration

### Frontend Environment Variables

Create `.env` file in the `front/` directory:

```bash
# Production API URL (replace with your domain)
VITE_API_BASE_URL=https://your-domain.com

# Development (optional)
# VITE_API_BASE_URL=http://localhost:5000
```

### Backend Environment Variables

Create `.env` file in the `back/` directory:

```bash
# Database
DATABASE_URL=your_supabase_connection_string

# JWT Secret (generate a strong secret)
JWT_SECRET=your_very_long_random_secret_key_here

# Cookie Settings (for production)
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
COOKIE_DOMAIN=your-domain.com

# Meta/WhatsApp Integration
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_REDIRECT_URI=https://your-domain.com/api/integrations/meta/callback

# Server Settings
PORT=5000
NODE_ENV=production
```

## 🚀 Deployment Steps

### 1. Backend Deployment (Node.js/Express)

#### Option A: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd back
vercel --prod
```

#### Option B: Railway
```bash
# Connect your GitHub repo to Railway
# Railway will auto-deploy from your main branch
```

#### Option C: DigitalOcean App Platform
```bash
# Create app from GitHub repository
# Set environment variables in DigitalOcean dashboard
```

### 2. Frontend Deployment (React/Vite)

#### Option A: Vercel
```bash
cd front
vercel --prod
```

#### Option B: Netlify
```bash
# Connect GitHub repo to Netlify
# Build command: npm run build
# Publish directory: dist
```

### 3. Database Setup (Supabase)

1. Create a Supabase project
2. Run the database schema from `create-complete-schema.sql`
3. Set up Row Level Security (RLS) policies
4. Copy connection string to backend environment variables

## 🔧 Production Configuration

### CORS Settings (Backend)

Update `back/server.js` for production:

```javascript
// Production CORS settings
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Cookie Settings (Backend)

Update `back/routes/auth.js` for production:

```javascript
// Production cookie settings
res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',
  domain: process.env.COOKIE_DOMAIN,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

### Frontend API Configuration

The frontend automatically uses environment variables:

```javascript
// front/src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? 
  `${import.meta.env.VITE_API_BASE_URL}/api` : 
  'http://localhost:5000/api'
```

## 🔍 Testing Authentication

### 1. Test Login Flow
```bash
# Test login endpoint
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -c cookies.txt
```

### 2. Test Protected Endpoint
```bash
# Test with cookies
curl -X GET https://your-domain.com/api/auth/me \
  -b cookies.txt
```

### 3. Test Logout
```bash
# Test logout clears cookies
curl -X POST https://your-domain.com/api/auth/logout \
  -b cookies.txt
```

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in backend
   - Ensure frontend domain is in allowed origins

2. **Cookie Not Set**
   - Verify HTTPS in production
   - Check cookie domain settings
   - Ensure `credentials: 'include'` in frontend requests

3. **Authentication Fails**
   - Check JWT_SECRET is set
   - Verify database connection
   - Check user table exists

### Debug Commands

```bash
# Check if backend is running
curl https://your-domain.com/api/health

# Check authentication status
curl https://your-domain.com/api/auth/me \
  -H "Cookie: authToken=your_token_here"

# Test database connection
curl https://your-domain.com/api/conversations/debug
```

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] CORS settings updated for production
- [ ] Cookie settings configured for HTTPS
- [ ] Frontend API URL updated
- [ ] SSL certificate installed (for HTTPS)
- [ ] Domain configured correctly
- [ ] All API endpoints tested
- [ ] Authentication flow tested
- [ ] File uploads working
- [ ] WhatsApp integration configured

## 🔒 Security Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Strong JWT Secret**: Generate a long, random JWT secret
3. **Cookie Security**: Set secure, httpOnly, and sameSite flags
4. **Environment Variables**: Never commit secrets to version control
5. **Database Security**: Use connection pooling and prepared statements
6. **Rate Limiting**: Implement rate limiting on auth endpoints
7. **Input Validation**: Validate all user inputs
8. **Error Handling**: Don't expose sensitive information in errors

## 📞 Support

If you encounter issues during deployment:

1. Check the browser console for errors
2. Check the backend logs
3. Verify environment variables are set correctly
4. Test API endpoints individually
5. Check CORS and cookie settings

Your ChatBot Platform is now ready for secure, production deployment! 🎉 