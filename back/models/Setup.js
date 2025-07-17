const supabase = require('../supabaseClient')

// Register setup info for a user
async function createSetup({ userId, businessName, industry, description, availability, catalogText, catalogProducts, businessLocation, businessContact }) {
  console.log('🔍 Creating setup with:', { userId, businessName, industry, description, availability, catalogText, catalogProducts, businessLocation, businessContact });
  
  const { data, error } = await supabase
    .from('businesses')
    .insert([
      {
        user_id: userId,
        business_name: businessName,
        industry: industry,
        business_description: description,
        business_availability: availability,
        catalog_text: catalogText || null,
        catalog_products: catalogProducts || null,
        business_location: businessLocation || null,
        business_contact: businessContact || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ])
    .select()
    .single()
    
  if (error) {
    console.error('❌ Error in createSetup:', error);
    throw error;
  }
  
  console.log('✅ Setup created successfully:', data);
  return data
}

module.exports = { createSetup } 