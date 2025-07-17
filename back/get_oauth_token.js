require('dotenv').config();
const axios = require('axios');

async function getOAuthToken() {
  const META_APP_ID = process.env.META_APP_ID;
  const META_APP_SECRET = process.env.META_APP_SECRET;
  const META_REDIRECT_URI = process.env.META_REDIRECT_URI;
  
  console.log('🔐 Getting OAuth Access Token for WhatsApp...\n');
  
  if (!META_APP_ID || !META_APP_SECRET) {
    console.log('❌ META_APP_ID or META_APP_SECRET not set in .env file');
    console.log('Please add your Meta App credentials to .env file');
    return;
  }
  
  console.log('📋 OAuth Configuration:');
  console.log('App ID:', META_APP_ID);
  console.log('Redirect URI:', META_REDIRECT_URI);
  console.log('\n🔗 Step 1: Open this URL in your browser:');
  
  const state = Math.random().toString(36).substring(2);
  const scope = 'whatsapp_business_management,whatsapp_business_messaging,business_management';
  
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(META_REDIRECT_URI)}&state=${state}&scope=${scope}`;
  
  console.log(authUrl);
  console.log('\n📝 Step 2: After authorization, copy the "code" parameter from the URL');
  console.log('Step 3: Paste the code here when prompted');
  
  // For now, we'll show the manual steps
  console.log('\n💡 Manual Steps:');
  console.log('1. Open the URL above in your browser');
  console.log('2. Authorize your app');
  console.log('3. Copy the "code" from the redirect URL');
  console.log('4. Use this code to get the access token');
  
  console.log('\n🔧 Alternative: Use the Meta integration endpoint:');
  console.log(`GET ${META_REDIRECT_URI.replace('/callback', '/start')}`);
}

getOAuthToken().catch(console.error); 