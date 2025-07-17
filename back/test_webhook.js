const axios = require('axios');

async function testWebhook() {
  const webhookUrl = 'https://8bb52bea7430.ngrok-free.app/whatsapp/webhook';
  
  console.log('🔍 Testing WhatsApp webhook...\n');
  
  try {
    // Test 1: Basic GET request
    console.log('1. Testing basic GET request...');
    const response1 = await axios.get(webhookUrl);
    console.log('✅ GET request successful');
    console.log('Status:', response1.status);
    console.log('Response:', response1.data);
  } catch (error) {
    console.log('❌ GET request failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }
  
  console.log('\n2. Testing with verification parameters...');
  
  // Test 2: With verification parameters
  const verifyToken = 'test_token_123';
  const testUrl = `${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=test_challenge`;
  
  try {
    const response2 = await axios.get(testUrl);
    console.log('✅ Verification test successful');
    console.log('Status:', response2.status);
    console.log('Response:', response2.data);
  } catch (error) {
    console.log('❌ Verification test failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }
  
  console.log('\n3. Testing POST request...');
  
  // Test 3: POST request (simulating WhatsApp message)
  try {
    const response3 = await axios.post(webhookUrl, {
      object: 'whatsapp_business_account',
      entry: [{
        id: 'test_id',
        changes: [{
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '1234567890',
              phone_number_id: 'test_phone_id'
            }
          }
        }]
      }]
    });
    console.log('✅ POST request successful');
    console.log('Status:', response3.status);
  } catch (error) {
    console.log('❌ POST request failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }
}

testWebhook().catch(console.error); 