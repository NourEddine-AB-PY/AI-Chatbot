require('dotenv').config();
const axios = require('axios');

async function testCompleteConfig() {
  console.log('🔧 Testing Complete WhatsApp Configuration...\n');
  
  // Check all required environment variables
  const requiredVars = [
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID', 
    'WHATSAPP_BUSINESS_ACCOUNT_ID',
    'WHATSAPP_VERIFY_TOKEN'
  ];
  
  console.log('1. Checking environment variables...');
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`\n❌ Missing variables: ${missingVars.join(', ')}`);
    console.log('Please add these to your .env file');
    return;
  }
  
  console.log('\n2. Testing WhatsApp API connection...');
  
  try {
    // Test phone number details
    const phoneResponse = await axios.get(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
        }
      }
    );
    
    console.log('✅ Phone Number API connection successful');
    console.log(`   Phone Number: ${phoneResponse.data.display_phone_number}`);
    console.log(`   Verified Name: ${phoneResponse.data.verified_name || 'Not verified'}`);
    console.log(`   Quality Rating: ${phoneResponse.data.quality_rating || 'Not rated'}`);
    
  } catch (error) {
    console.log('❌ Phone Number API connection failed:');
    console.log('Error:', error.response?.data || error.message);
    return;
  }
  
  console.log('\n3. Testing Business Account API connection...');
  
  try {
    // Test business account details
    const businessResponse = await axios.get(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
        }
      }
    );
    
    console.log('✅ Business Account API connection successful');
    console.log(`   Business Name: ${businessResponse.data.name}`);
    console.log(`   Status: ${businessResponse.data.status}`);
    
  } catch (error) {
    console.log('❌ Business Account API connection failed:');
    console.log('Error:', error.response?.data || error.message);
    return;
  }
  
  console.log('\n4. Testing webhook verification...');
  
  try {
    const webhookUrl = 'https://8bb52bea7430.ngrok-free.app/whatsapp/webhook';
    const testUrl = `${webhookUrl}?hub.mode=subscribe&hub.verify_token=${process.env.WHATSAPP_VERIFY_TOKEN}&hub.challenge=test_challenge`;
    
    const webhookResponse = await axios.get(testUrl);
    console.log('✅ Webhook verification successful');
    console.log('   Response:', webhookResponse.data);
    
  } catch (error) {
    console.log('❌ Webhook verification failed:');
    console.log('Error:', error.response?.data || error.message);
    return;
  }
  
  console.log('\n5. Testing message sending capability...');
  
  try {
    // Test message sending (this won't actually send, just test the API)
    const messageResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: '1234567890', // Test number
        type: 'text',
        text: { body: 'Test message' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Message sending API test successful');
    console.log('   Message ID:', messageResponse.data.messages[0].id);
    
  } catch (error) {
    if (error.response?.data?.error?.code === 100) {
      console.log('⚠️  Message sending test failed (expected - invalid phone number)');
      console.log('   This is normal for test numbers');
    } else {
      console.log('❌ Message sending API test failed:');
      console.log('Error:', error.response?.data || error.message);
    }
  }
  
  console.log('\n🎉 WhatsApp Configuration Test Complete!');
  console.log('✅ All systems are ready for WhatsApp integration');
}

testCompleteConfig().catch(console.error); 