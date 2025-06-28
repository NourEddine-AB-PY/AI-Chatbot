const supabase = require('../supabaseClient')

// Helper functions for bot operations
async function getBotsByUserId(userId) {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('userId', userId)
  if (error) return []
  return data
}

async function createBot({ name, description, userId }) {
  console.log('Attempting to create bot:', { name, description, userId });
  const { data, error } = await supabase
    .from('bots')
    .insert([{ name, description, userId }])
    .select()
    .single()
  if (error) {
    console.error('Supabase createBot error:', error)
    return null
  }
  return data
}

async function updateBot(id, userId, { name, description }) {
  const { data, error } = await supabase
    .from('bots')
    .update({ name, description })
    .eq('id', id)
    .eq('userId', userId)
    .select()
    .single()
  if (error) return null
  return data
}

async function deleteBot(id, userId) {
  const { error } = await supabase
    .from('bots')
    .delete()
    .eq('id', id)
    .eq('userId', userId)
  return !error
}

module.exports = { getBotsByUserId, createBot, updateBot, deleteBot } 