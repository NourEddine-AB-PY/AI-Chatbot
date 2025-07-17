require('dotenv').config();
const WhatsAppConfig = require('./utils/whatsappConfig');

async function testWhatsAppConfiguration() {
  console.log('🔧 Testing WhatsApp Configuration...\n');
  
  const config = new WhatsAppConfig();
  
  // Test 1: Validate configuration
  console.log('1. Validating configuration...');
  const validation = config.validateConfig();
  
  if (validation.isValid) {
    console.log('✅ Configuration is valid');
  } else {
    console.log('❌ Configuration errors:');
    validation.errors.forEach(error => console.log(`   - ${error}`));
    return;
  }
  
  // Test 2: Test API connection
  console.log('\n2. Testing API connection...');
  const connectionTest = await config.testConnection();
  
  if (connectionTest.success) {
    console.log('✅ API connection successful');
    console.log(`   Phone Number ID: ${connectionTest.data.id}`);
    console.log(`   Display Name: ${connectionTest.data.display_name || 'N/A'}`);
    console.log(`   Quality Rating: ${connectionTest.data.quality_rating || 'N/A'}`);
  } else {
    console.log('❌ API connection failed:');
    console.log(`   Error: ${connectionTest.error}`);
    return;
  }
  
  // Test 3: Get phone number details
  console.log('\n3. Getting phone number details...');
  const phoneDetails = await config.getPhoneNumberDetails();
  
  if (phoneDetails.success) {
    console.log('✅ Phone number details retrieved');
    console.log(`   Phone Number: ${phoneDetails.phoneNumber.verified_name || 'N/A'}`);
    console.log(`   Code Quality: ${phoneDetails.phoneNumber.code_verification_status || 'N/A'}`);
    console.log(`   Quality Rating: ${phoneDetails.phoneNumber.quality_rating || 'N/A'}`);
  } else {
    console.log('❌ Failed to get phone number details:');
    console.log(`   Error: ${phoneDetails.error}`);
  }
  
  // Test 4: Get business account details
  console.log('\n4. Getting business account details...');
  const businessDetails = await config.getBusinessAccountDetails();
  
  if (businessDetails.success) {
    console.log('✅ Business account details retrieved');
    console.log(`   Account ID: ${businessDetails.businessAccount.id}`);
    console.log(`   Name: ${businessDetails.businessAccount.name || 'N/A'}`);
    console.log(`   Status: ${businessDetails.businessAccount.status || 'N/A'}`);
  } else {
    console.log('❌ Failed to get business account details:');
    console.log(`   Error: ${businessDetails.error}`);
  }
  
  // Test 5: Verify webhook configuration
  console.log('\n5. Checking webhook configuration...');
  const webhookUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/whatsapp/webhook`;
  const webhookTest = await config.verifyWebhook(webhookUrl);
  
  if (webhookTest.success) {
    if (webhookTest.isConfigured) {
      console.log('✅ Webhook is configured');
      console.log(`   URL: ${webhookUrl}`);
    } else {
      console.log('⚠️  Webhook is not configured');
      console.log(`   Expected URL: ${webhookUrl}`);
      console.log('   Available webhooks:');
      webhookTest.webhooks.forEach(webhook => {
        console.log(`     - ${webhook.callback_url}`);
      });
    }
  } else {
    console.log('❌ Failed to check webhook configuration:');
    console.log(`   Error: ${webhookTest.error}`);
  }
  
  // Test 6: Test phone number formatting
  console.log('\n6. Testing phone number formatting...');
  const testNumbers = [
    '+1234567890',
    '1234567890',
    '(123) 456-7890',
    '123-456-7890',
    '+44 20 7946 0958'
  ];
  
  testNumbers.forEach(number => {
    const formatted = config.formatPhoneNumber(number);
    const isValid = config.validatePhoneNumber(number);
    console.log(`   ${number} → ${formatted} (${isValid ? '✅ Valid' : '❌ Invalid'})`);
  });
  
  console.log('\n🎉 WhatsApp configuration test completed!');
}

// Run the test
testWhatsAppConfiguration().catch(console.error); 