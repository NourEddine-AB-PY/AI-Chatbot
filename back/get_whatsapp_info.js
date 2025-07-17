require('dotenv').config();
const axios = require('axios');

async function getWhatsAppInfo() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.log('❌ WHATSAPP_ACCESS_TOKEN not set in .env file');
    console.log('You need to get this from Meta Developer Dashboard');
    return;
  }
  
  console.log('🔍 Retrieving WhatsApp Business Account information...\n');
  
  try {
    // Step 1: Get user's businesses
    console.log('1. Getting businesses...');
    const businessesResponse = await axios.get('https://graph.facebook.com/v19.0/me/businesses', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ Businesses found:', businessesResponse.data.data.length);
    
    // Step 2: Get WhatsApp Business accounts for each business
    for (const business of businessesResponse.data.data) {
      console.log(`\n2. Getting WhatsApp accounts for business: ${business.name} (${business.id})`);
      
      const waAccountsResponse = await axios.get(`https://graph.facebook.com/v19.0/${business.id}/owned_whatsapp_business_accounts`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (waAccountsResponse.data.data.length > 0) {
        console.log('✅ WhatsApp Business accounts found:', waAccountsResponse.data.data.length);
        
        // Step 3: Get phone numbers for each WhatsApp account
        for (const waAccount of waAccountsResponse.data.data) {
          console.log(`\n3. Getting phone numbers for WhatsApp account: ${waAccount.name} (${waAccount.id})`);
          
          const phoneNumbersResponse = await axios.get(`https://graph.facebook.com/v19.0/${waAccount.id}/phone_numbers`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          console.log('✅ Phone numbers found:', phoneNumbersResponse.data.data.length);
          
          // Display all information
          console.log('\n📋 WhatsApp Configuration Information:');
          console.log('=====================================');
          console.log(`Business Account ID: ${waAccount.id}`);
          console.log(`Business Name: ${waAccount.name}`);
          console.log(`Business Status: ${waAccount.status}`);
          
          phoneNumbersResponse.data.data.forEach((phone, index) => {
            console.log(`\nPhone Number ${index + 1}:`);
            console.log(`  Phone Number ID: ${phone.id}`);
            console.log(`  Display Name: ${phone.verified_name || 'Not verified'}`);
            console.log(`  Phone Number: ${phone.display_phone_number}`);
            console.log(`  Quality Rating: ${phone.quality_rating || 'Not rated'}`);
            console.log(`  Code Verification: ${phone.code_verification_status || 'Not verified'}`);
          });
          
          console.log('\n📝 Add these to your .env file:');
          console.log(`WHATSAPP_BUSINESS_ACCOUNT_ID=${waAccount.id}`);
          console.log(`WHATSAPP_PHONE_NUMBER_ID=${phoneNumbersResponse.data.data[0]?.id || 'NOT_FOUND'}`);
          console.log(`WHATSAPP_ACCESS_TOKEN=${accessToken}`);
        }
      } else {
        console.log('❌ No WhatsApp Business accounts found for this business');
      }
    }
    
  } catch (error) {
    console.log('❌ Error retrieving WhatsApp information:');
    console.log('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 This might be because:');
      console.log('1. Your access token is invalid or expired');
      console.log('2. You need to add WhatsApp Business API to your app');
      console.log('3. You need to request the correct permissions');
    }
  }
}

getWhatsAppInfo().catch(console.error); 