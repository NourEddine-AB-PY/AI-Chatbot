const supabase = require('../supabaseClient')

// Helper functions for user operations
async function findUserByEmail(email) {
  console.log('🔍 Looking for user with email:', email);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  if (error) {
    console.error('❌ Error finding user:', error);
    return null;
  }
  console.log('✅ User found:', data ? 'Yes' : 'No');
  return data
}

async function createUser({ name, email, password }) {
  console.log('🔍 Creating user:', { name, email, hasPassword: !!password });
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password }])
    .select()
    .single()
  if (error) {
    console.error('❌ Error creating user:', error);
    return null;
  }
  console.log('✅ User created successfully:', data);
  return data
}

module.exports = { findUserByEmail, createUser } 