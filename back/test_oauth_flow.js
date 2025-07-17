require('dotenv').config();
const axios = require('axios');

async function testOAuthFlow() {
  console.log('🔍 Testing OAuth Flow Configuration...\n');
  
  const META_APP_ID = process.env.META_APP_ID;
  const META_APP_SECRET = process.env.META_APP_SECRET;
  const META_REDIRECT_URI = process.env.META_REDIRECT_URI;
  
  console.log('📋 OAuth Configuration:');
  console.log('App ID:', META_APP_ID ? '✅ Set' : '❌ Missing');
  console.log('App Secret:', META_APP_SECRET ? '✅ Set' : '❌ Missing');
  console.log('Redirect URI:', META_REDIRECT_URI);
  
  if (!META_APP_ID || !META_APP_SECRET) {
    console.log('\n❌ Missing META_APP_ID or META_APP_SECRET');
    console.log('Please add these to your .env file');
    return;
  }
  
  console.log('\n🔗 OAuth URL:');
  const state = Math.random().toString(36).substring(2);
  const scope = 'whatsapp_business_management,whatsapp_business_messaging,business_management';
  
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(META_REDIRECT_URI)}&state=${state}&scope=${scope}`;
  
  console.log(authUrl);
  
  console.log('\n🔧 Troubleshooting Steps:');
  console.log('1. Go to Meta Developer Dashboard');
  console.log('2. Check App Settings → Basic:');
  console.log('   - App Mode should be "Development"');
  console.log('   - Privacy Policy URL should be set');
  console.log('   - Terms of Service URL should be set');
  console.log('3. Check Facebook Login → Settings:');
  console.log('   - Valid OAuth Redirect URIs should include:');
  console.log(`   ${META_REDIRECT_URI}`);
  console.log('4. Check Facebook Login → Permissions:');
  console.log('   - Add: whatsapp_business_management');
  console.log('   - Add: whatsapp_business_messaging');
  console.log('   - Add: business_management');
  console.log('5. If app is in "Live" mode, switch to "Development"');
  
  console.log('\n💡 Alternative: Test with direct OAuth URL');
  console.log('Copy and paste this URL in your browser:');
  console.log(authUrl);
}

testOAuthFlow().catch(console.error); 