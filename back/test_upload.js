const fs = require('fs');
const path = require('path');

// Test if uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
console.log('Uploads directory path:', uploadsDir);

if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory exists');
  const files = fs.readdirSync(uploadsDir);
  console.log('Files in uploads directory:', files);
} else {
  console.log('❌ Uploads directory does not exist');
}

// Test if we can create the directory
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
  }
} catch (error) {
  console.error('❌ Failed to create uploads directory:', error.message);
}

console.log('Test completed'); 