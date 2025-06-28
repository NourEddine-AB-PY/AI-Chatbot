const supabase = require('../supabaseClient')

// Register setup info for a user
async function createSetup({ userId, businessName, industry, website, tone, specialties, businessHours }) {
  const { data, error } = await supabase
    .from('business_setups')
    .insert([
      {
        user_id: userId,
        business_name: businessName,
        industry,
        website,
        tone,
        specialties,
        business_hours: businessHours,
      },
    ])
  if (error) throw error
  return data && data[0]
}

module.exports = { createSetup } 