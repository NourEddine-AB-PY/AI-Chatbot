require('dotenv').config();
const axios = require('axios');

async function testWebhookWithToken() {
  const webhookUrl = 'https://8bb52bea7430.ngrok-free.app/whatsapp/webhook';
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  
  console.log('🔍 Testing WhatsApp webhook with actual token...\n');
  console.log('Using token:', verifyToken ? verifyToken.substring(0, 10) + '...' : 'NOT SET');
  
  if (!verifyToken) {
    console.log('❌ WHATSAPP_VERIFY_TOKEN not set in .env file');
    console.log('Run: node generate_verify_token.js');
    return;
  }
  
  // Test with actual token
  const testUrl = `${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=test_challenge`;
  
  try {
    const response = await axios.get(testUrl);
    console.log('✅ Webhook verification successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    console.log('\n🎉 Your webhook is ready for Meta configuration!');
  } catch (error) {
    console.log('❌ Webhook verification failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }
}

testWebhookWithToken().catch(console.error); 