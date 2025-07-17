require('dotenv').config();
const axios = require('axios');

async function sendTestMessage() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  console.log('📱 Sending Test WhatsApp Message...\n');
  
  if (!accessToken || !phoneNumberId) {
    console.log('❌ Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID');
    return;
  }
  
  // Get recipient phone number from user
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Enter recipient phone number (with country code, e.g., +1234567890): ', async (recipientPhone) => {
    rl.close();
    
    if (!recipientPhone) {
      console.log('❌ No phone number provided');
      return;
    }
    
    // Format phone number (remove + and any non-digits)
    const formattedPhone = recipientPhone.replace(/\D/g, '');
    
    try {
      console.log(`📤 Sending message to ${recipientPhone}...`);
      
      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: { 
            body: 'Hello! This is a test message from your WhatsApp Business API integration. 🚀' 
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Message sent successfully!');
      console.log('Message ID:', response.data.messages[0].id);
      console.log('Recipient:', recipientPhone);
      console.log('\n🎉 WhatsApp integration is working perfectly!');
      
    } catch (error) {
      console.log('❌ Failed to send message:');
      console.log('Error:', error.response?.data || error.message);
      
      if (error.response?.data?.error?.code === 100) {
        console.log('\n💡 This might be because:');
        console.log('1. The phone number is not registered on WhatsApp');
        console.log('2. The phone number format is incorrect');
        console.log('3. You need to use a verified phone number for testing');
      }
    }
  });
}

sendTestMessage().catch(console.error); 