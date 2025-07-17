require('dotenv').config();
const axios = require('axios');

async function checkMessageStatus() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  console.log('📊 Checking WhatsApp Message Status...\n');
  
  if (!accessToken || !phoneNumberId) {
    console.log('❌ Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID');
    return;
  }
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Enter the Message ID from the previous test: ', async (messageId) => {
    rl.close();
    
    if (!messageId) {
      console.log('❌ No Message ID provided');
      return;
    }
    
    try {
      console.log(`🔍 Checking status for message: ${messageId}...`);
      
      const response = await axios.get(
        `https://graph.facebook.com/v19.0/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      console.log('✅ Message status retrieved:');
      console.log('Message ID:', response.data.id);
      console.log('Status:', response.data.status);
      console.log('Timestamp:', response.data.timestamp);
      
      if (response.data.status === 'sent') {
        console.log('\n📱 Message Status: SENT');
        console.log('The message was sent to WhatsApp servers');
        console.log('Check your phone - it might be in spam or take a few minutes');
      } else if (response.data.status === 'delivered') {
        console.log('\n📱 Message Status: DELIVERED');
        console.log('The message was delivered to the recipient');
        console.log('Check your WhatsApp app');
      } else if (response.data.status === 'read') {
        console.log('\n📱 Message Status: READ');
        console.log('The message was read by the recipient');
      } else {
        console.log('\n📱 Message Status:', response.data.status);
      }
      
    } catch (error) {
      console.log('❌ Failed to check message status:');
      console.log('Error:', error.response?.data || error.message);
    }
  });
}

checkMessageStatus().catch(console.error); 