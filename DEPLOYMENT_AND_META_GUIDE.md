# 🚀 Complete Deployment & Meta Development Guide

## 📋 Table of Contents1Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4ta Developer Setup](#meta-developer-setup)
5. [Production Deployment](#production-deployment)
6. [AI Agent Deployment](#ai-agent-deployment)
7. [SSL & Domain Configuration](#ssl--domain-configuration)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Accounts & Services
- **Domain Name** (e.g., yourdomain.com)
- **VPS/Server** (Ubuntu 20.4 recommended)
- **Supabase Account** (for database)
- **Meta Developer Account** (for WhatsApp/Facebook)
- **GitHub Account** (for code repository)

### Server Requirements
- **CPU**: 2+ cores
- **RAM**:4B+ 
- **Storage**: 20GB+
- **OS**: Ubuntu 200.04TS or newer

---

## 🌍 Environment Setup

###1rver Initial Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git nginx certbot python3t-nginx

# Install Node.js 18url -fsSL https://deb.nodesource.com/setup_18 | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Python3.8+ and pip
sudo apt install -y python3 python3pip python3-venv

# Verify installations
node --version  # Should be v18.x.x
npm --version   # Should be 9.x.x or higher
python3 --version  # Should be 3.8+
```

### 2. Clone Repository

```bash
# Clone the project
git clone <your-repository-url>
cd ChatBot_Project

# Set proper permissions
sudo chown -R $USER:$USER .
```

---

## 🗄️ Database Configuration

###1. Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down: Project URL, Anon Key, Service Role Key

2. **Database Schema Setup**
   ```bash
   # Connect to Supabase SQL Editor
   # Run these scripts in order:
   ```

   **Step 1: Create Tables**
   ```sql
   -- Run: create-complete-schema.sql
   -- This creates all necessary tables
   ```

   **Step2 Setup Security**
   ```sql
   -- Run: setup-rls-policies-fixed.sql
   -- This enables Row Level Security
   ```

   **Step 3: Create Admin User**
   ```sql
   -- Run: promote-to-admin.sql
   -- Or manually create admin:
   INSERT INTO users (email, password, role) 
   VALUES ('admin@yourdomain.com',hashed_password_here', admin');
   ```

3atabase Connection**
   ```bash
   cd back
   npm install
   cp env.example .env
   # Edit .env with Supabase credentials
   npm run dev
   ```

---

## 📱 Meta Developer Setup

###1 Developer Account Setup1ate Meta Developer Account**
   - Go to [developers.facebook.com](https://developers.facebook.com)
   - Create account and verify email
   - Complete business verification if required2 **Create Meta App**
   ```bash
   # In Meta Developer Console:
 1 Click Create App"
   2. Choose "Business" type3ill in app details
  4 Note down: App ID, App Secret
   ```

### 2. WhatsApp Business API Setup

1. **Enable WhatsApp Business API**
   ```bash
   # In your Meta App:
   1. Go to Add Products"
   2ind "WhatsApp" and click "Set Up"
   3. Choose Business account type
   4. Complete business verification
   ```

2. **Configure WhatsApp Webhook**
   ```bash
   # You'll need these values:
   - Verify Token: Create a random string (e.g., "your_webhook_verify_token_123)
   - Webhook URL: https://yourdomain.com/api/whatsapp/webhook
   - Access Token: Generated from Meta
   - Phone Number ID: Your WhatsApp business number ID
   ```
3*Get Required Credentials**
   ```bash
   # From Meta Developer Console, note:
   - META_APP_ID
   - META_APP_SECRET
   - WHATSAPP_ACCESS_TOKEN
   - WHATSAPP_PHONE_NUMBER_ID
   - WHATSAPP_BUSINESS_ACCOUNT_ID
   ```

### 3. Facebook Messenger Setup (Optional)

1. **Enable Facebook Messenger**
   ```bash
   # In your Meta App:
   1. Go to Add Products2. Find "Messenger" and click "Set Up"
 3 Configure webhook for Messenger events
   ```

---

## 🚀 Production Deployment

### 1. Backend Deployment

```bash
# Navigate to backend
cd back

# Install dependencies
npm install

# Create production environment file
cp env.production.example .env
```

**Edit `.env` file with your values:**
```env
# Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_very_long_random_jwt_secret_here_32_chars_min

# Meta Developer API Configuration
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_REDIRECT_URI=https://yourdomain.com/api/integrations/meta/callback

# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_whatsapp_business_account_id
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/api/whatsapp/webhook

# Server Configuration
PORT=5000
NODE_ENV=production
BASE_URL=https://yourdomain.com

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com

# Cookie Configuration
COOKIE_DOMAIN=.yourdomain.com
```

```bash
# Start backend with PM22 server.production.js --name chatbot-backend
pm2 save
pm2 startup
```

### 2. Frontend Deployment

```bash
# Navigate to frontend
cd front

# Install dependencies
npm install

# Create production environment file
cp env.example .env.production
```

**Edit `.env.production` file:**
```env
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your_supabase_anon_key
```

```bash
# Build for production
npm run build

# Copy build to nginx directory
sudo cp -r dist/* /var/www/chatbot/
```

### 3. AI Agent Deployment

```bash
# Navigate to AI agent
cd AI-agent

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file for AI agent
cp env.example .env
```

**Edit AI agent `.env` file:**
```env
FLASK_ENV=production
COHERE_API_KEY=your_cohere_api_key
GOOGLE_API_KEY=your_google_gemini_api_key
BACKEND_URL=https://yourdomain.com/api
```

```bash
# Start AI agent with PM2m2 start app.py --name chatbot-ai --interpreter python3
pm2 save
```

---

## 🔒 SSL & Domain Configuration

### 1. Nginx Configuration

```bash
# Create nginx site configuration
sudo nano /etc/nginx/sites-available/chatbot
```

**Add this configuration:**
```nginx
# HTTP to HTTPS redirect
server[object Object]    listen 80  server_name yourdomain.com www.yourdomain.com;
    return 31tps://$server_name$request_uri;
}

# HTTPS server
server [object Object]    listen 443 http2  server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options nosniff" always;
    add_header Referrer-Policyno-referrer-when-downgrade" always;
    add_header Content-Security-Policy default-src self' http: https: data: blob: 'unsafe-inline'" always;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:500        proxy_http_version 1.1
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout86400 }

    # AI Agent API
    location /ai/ {
        proxy_pass http://localhost:501        proxy_http_version 1.1
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend static files
    location / {
        root /var/www/chatbot;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control public, immutable";
        }
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:500        access_log off;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 124;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site

# Test nginx configuration
sudo nginx -t

# Create web directory
sudo mkdir -p /var/www/chatbot
sudo chown -R $USER:$USER /var/www/chatbot
```

### 2 Certificate Setup

```bash
# Get SSL certificate with Certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

---

## 📊 Monitoring & Maintenance

### 1. PM2 Process Management

```bash
# Check all processes
pm2 list

# Monitor processes
pm2 monit

# View logs
pm2 logs chatbot-backend
pm2 logs chatbot-ai

# Restart services
pm2 restart chatbot-backend
pm2restart chatbot-ai

# Save PM2 configuration
pm2save
```

### 2. Nginx Monitoring

```bash
# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Test nginx configuration
sudo nginx -t
```

### 3. System Monitoring

```bash
# Check system resources
htop
df -h
free -h

# Check open ports
sudo netstat -tlnp
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Backend Not Starting
```bash
# Check logs
pm2 logs chatbot-backend

# Common issues:
# - Missing environment variables
# - Database connection issues
# - Port already in use

# Solutions:
# - Verify .env file is complete
# - Check Supabase connection
# - Kill process on port500 sudo lsof -ti:5000args kill -9
```

####2ntend Build Issues
```bash
# Clear cache and rebuild
cd front
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 3. WhatsApp Webhook Issues
```bash
# Verify webhook URL is accessible
curl -X GET https://yourdomain.com/api/whatsapp/webhook

# Check webhook logs
pm2 logs chatbot-backend | grep webhook

# Common issues:
# - SSL certificate not valid
# - Webhook URL not publicly accessible
# - Verify token mismatch
```

#### 4. Database Connection Issues
```bash
# Test Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"

# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

#### 5Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check nginx SSL configuration
sudo nginx -t
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_conversations_business_id ON conversations(business_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_users_email ON users(email);
```

####2 Caching Setup
```bash
# Install Redis for caching (optional)
sudo apt install redis-server
sudo systemctl enable redis-server
```

#### 3. CDN Setup
```bash
# Consider using Cloudflare or similar CDN for:
# - Static asset delivery
# - DDoS protection
# - SSL termination
```

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

1eekly**
   - Check PM2 process status
   - Review error logs
   - Monitor disk space
2. **Monthly**
   - Update system packages
   - Renew SSL certificates
   - Backup database
3. **Quarterly**
   - Update Node.js and Python dependencies
   - Review security configurations
   - Performance optimization

### Emergency Contacts

- **Server Provider**: Your VPS provider support
- **Domain Registrar**: Your domain provider support
- **Meta Developer Support**: [developers.facebook.com/support](https://developers.facebook.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)

---

## ✅ Deployment Checklist

- [ ] Server setup complete
- [ ] Domain DNS configured
- [ ] Supabase project created and configured
- [ ] Database schema deployed
- Meta Developer app created
- [ ] WhatsApp Business API configured
- [ ] Environment variables set
- [ ] Backend deployed with PM2
- Frontend built and deployed
- [ ] AI agent deployed
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] All services running
- [ ] Webhook endpoints tested
- [ ] Admin user created
- [ ] Monitoring setup complete

---

**🎉 Congratulations! Your ChatBot platform is now deployed and ready for production use.**

For additional support or questions, refer to the troubleshooting section or contact the development team. 