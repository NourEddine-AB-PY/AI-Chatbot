require('dotenv').config();
const axios = require('axios');

async function checkPhoneStatus() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  console.log('📱 Checking WhatsApp Phone Number Status...\n');
  
  if (!accessToken || !phoneNumberId) {
    console.log('❌ Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID');
    return;
  }
  
  try {
    console.log('1. Getting phone number details...');
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${phoneNumberId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    console.log('✅ Phone number details:');
    console.log('Phone Number ID:', response.data.id);
    console.log('Display Phone Number:', response.data.display_phone_number);
    console.log('Verified Name:', response.data.verified_name || 'Not verified');
    console.log('Quality Rating:', response.data.quality_rating || 'Not rated');
    console.log('Code Verification Status:', response.data.code_verification_status || 'Not verified');
    console.log('Business Account ID:', response.data.whatsapp_business_account_id);
    
    console.log('\n2. Checking message sending capability...');
    
    // Check if we can send messages
    if (response.data.code_verification_status === 'VERIFIED') {
      console.log('✅ Phone number is verified - can send messages');
    } else {
      console.log('⚠️  Phone number is not verified - message sending may be limited');
    }
    
    if (response.data.quality_rating === 'GREEN') {
      console.log('✅ Quality rating is GREEN - good for sending messages');
    } else if (response.data.quality_rating === 'YELLOW') {
      console.log('⚠️  Quality rating is YELLOW - some limitations may apply');
    } else if (response.data.quality_rating === 'RED') {
      console.log('❌ Quality rating is RED - message sending may be blocked');
    } else {
      console.log('ℹ️  Quality rating not available yet');
    }
    
    console.log('\n3. Possible reasons for not receiving messages:');
    console.log('   - Phone number not verified (code_verification_status)');
    console.log('   - Quality rating too low');
    console.log('   - First message restrictions (24-hour window)');
    console.log('   - Recipient number format issues');
    console.log('   - WhatsApp Business API limitations');
    
    console.log('\n4. Next steps:');
    if (response.data.code_verification_status !== 'VERIFIED') {
      console.log('   🔧 Verify your phone number in Meta Developer Dashboard');
    }
    console.log('   📱 Try sending to a different verified number');
    console.log('   ⏰ Wait 24 hours for first message restrictions to lift');
    
  } catch (error) {
    console.log('❌ Failed to check phone status:');
    console.log('Error:', error.response?.data || error.message);
  }
}

checkPhoneStatus().catch(console.error); 