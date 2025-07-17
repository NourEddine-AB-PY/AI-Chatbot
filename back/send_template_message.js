require('dotenv').config();
const axios = require('axios');

async function sendTemplateMessage() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  console.log('📱 Sending WhatsApp Template Message...\n');
  
  if (!accessToken || !phoneNumberId) {
    console.log('❌ Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID');
    return;
  }
  
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
      console.log(`📤 Sending template message to ${recipientPhone}...`);
      
      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'template',
          template: {
            name: 'hello_world',
            language: {
              code: 'en_US'
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Template message sent successfully!');
      console.log('Message ID:', response.data.messages[0].id);
      console.log('Recipient:', recipientPhone);
      console.log('Template: hello_world');
      console.log('\n🎉 Template message sent! Check your WhatsApp.');
      
    } catch (error) {
      console.log('❌ Failed to send template message:');
      console.log('Error:', error.response?.data || error.message);
      
      if (error.response?.data?.error?.code === 100) {
        console.log('\n💡 This might be because:');
        console.log('1. The hello_world template is not available');
        console.log('2. You need to create a custom template');
        console.log('3. The phone number is not registered on WhatsApp');
      }
    }
  });
}

sendTemplateMessage().catch(console.error); 