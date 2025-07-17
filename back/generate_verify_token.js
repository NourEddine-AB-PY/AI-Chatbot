// Generate a secure verify token for WhatsApp webhook
const crypto = require('crypto');

const verifyToken = crypto.randomBytes(32).toString('hex');
console.log('🔐 Generated WhatsApp Verify Token:');
console.log(verifyToken);
console.log('\n📝 Add this to your .env file as:');
console.log(`WHATSAPP_VERIFY_TOKEN=${verifyToken}`);
console.log('\n📝 Use this same token in Meta Developer WhatsApp configuration'); 