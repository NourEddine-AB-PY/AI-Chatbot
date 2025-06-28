const supabase = require('../supabaseClient')

// Helper functions for user operations
async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  if (error) return null
  return data
}

async function createUser({ name, email, password }) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password }])
    .select()
    .single()
  if (error) return null
  return data
}

module.exports = { findUserByEmail, createUser } 