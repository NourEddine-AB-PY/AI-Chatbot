require('dotenv').config();
const axios = require('axios');

async function getBusinessAccountId() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  console.log('🔍 Getting Business Account ID...\n');
  
  if (!accessToken || !phoneNumberId) {
    console.log('❌ Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID');
    return;
  }
  
  try {
    // Get phone number details which includes the business account ID
    console.log('1. Getting phone number details...');
    const phoneResponse = await axios.get(
      `https://graph.facebook.com/v19.0/${phoneNumberId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    console.log('✅ Phone number details retrieved');
    console.log('Phone Number:', phoneResponse.data.display_phone_number);
    console.log('Verified Name:', phoneResponse.data.verified_name || 'Not verified');
    
    // The business account ID should be in the response
    if (phoneResponse.data.whatsapp_business_account_id) {
      console.log('\n📋 Business Account ID found:');
      console.log('=====================================');
      console.log(`WHATSAPP_BUSINESS_ACCOUNT_ID=${phoneResponse.data.whatsapp_business_account_id}`);
      console.log('\n📝 Add this to your .env file');
    } else {
      console.log('\n🔍 Business Account ID not found in phone details, trying alternative method...');
      
      // Try to get it from the business accounts endpoint
      console.log('2. Getting business accounts...');
      const businessResponse = await axios.get(
        'https://graph.facebook.com/v19.0/me/businesses',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (businessResponse.data.data.length > 0) {
        console.log('✅ Business accounts found:', businessResponse.data.data.length);
        
        for (const business of businessResponse.data.data) {
          console.log(`\n3. Getting WhatsApp accounts for business: ${business.name}`);
          
          const waAccountsResponse = await axios.get(
            `https://graph.facebook.com/v19.0/${business.id}/owned_whatsapp_business_accounts`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );
          
          if (waAccountsResponse.data.data.length > 0) {
            console.log('✅ WhatsApp Business accounts found:');
            
            waAccountsResponse.data.data.forEach(account => {
              console.log(`\n📋 Business Account ID: ${account.id}`);
              console.log(`Business Name: ${account.name}`);
              console.log(`Status: ${account.status}`);
              console.log('\n📝 Add this to your .env file:');
              console.log(`WHATSAPP_BUSINESS_ACCOUNT_ID=${account.id}`);
            });
          }
        }
      } else {
        console.log('❌ No business accounts found');
      }
    }
    
  } catch (error) {
    console.log('❌ Error getting Business Account ID:');
    console.log('Error:', error.response?.data || error.message);
  }
}

getBusinessAccountId().catch(console.error); 