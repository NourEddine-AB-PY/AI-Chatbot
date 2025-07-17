// Load environment variables
require('dotenv').config();

const supabase = require('./supabaseClient');

async function testAnalytics() {
  console.log('🔍 Testing Analytics Data Sources...\n');

  // Check environment variables
  console.log('🔧 Environment Check:');
  console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SUPABASE_KEY: ${process.env.SUPABASE_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log('');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.log('❌ Missing required environment variables!');
    console.log('Please create a .env file in the back/ directory with:');
    console.log('SUPABASE_URL=your_supabase_url');
    console.log('SUPABASE_KEY=your_supabase_anon_key');
    return;
  }

  try {
    // Test conversations query
    console.log('📊 Testing Conversations...');
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('timestamp, business_id, phone_number')
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    console.log(`   Total conversations (last 7 days): ${conversations?.length || 0}`);
    if (convError) console.log(`   Error: ${convError.message}`);
    if (conversations && conversations.length > 0) {
      console.log(`   Sample conversation:`, conversations[0]);
    }
    
    // Test users query
    console.log('\n👥 Testing Users...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, name, email')
      .gte('createdat', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    console.log(`   Total users (last 7 days): ${users?.length || 0}`);
    if (userError) console.log(`   Error: ${userError.message}`);
    if (users && users.length > 0) {
      console.log(`   Sample user:`, users[0]);
    }
    
    // Test bots query
    console.log('\n🤖 Testing Bots...');
    const { data: bots, error: botError } = await supabase
      .from('bots')
      .select('id, name, userid, createdat')
      .gte('createdat', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    console.log(`   Total bots (last 7 days): ${bots?.length || 0}`);
    if (botError) console.log(`   Error: ${botError.message}`);
    if (bots && bots.length > 0) {
      console.log(`   Sample bot:`, bots[0]);
    }
    
    // Test businesses query
    console.log('\n🏢 Testing Businesses...');
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id, name, user_id, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    console.log(`   Total businesses (last 7 days): ${businesses?.length || 0}`);
    if (bizError) console.log(`   Error: ${bizError.message}`);
    if (businesses && businesses.length > 0) {
      console.log(`   Sample business:`, businesses[0]);
    }
    
    // Test business_setups query
    console.log('\n🏢 Testing Business Setups...');
    const { data: businessSetups, error: setupError } = await supabase
      .from('business_setups')
      .select('id, business_name, user_id, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    console.log(`   Total business setups (last 7 days): ${businessSetups?.length || 0}`);
    if (setupError) console.log(`   Error: ${setupError.message}`);
    if (businessSetups && businessSetups.length > 0) {
      console.log(`   Sample business setup:`, businessSetups[0]);
    }
    
    // Test integrations query
    console.log('\n🔗 Testing Integrations...');
    const { data: integrations, error: intError } = await supabase
      .from('integrations')
      .select('id, type, status, created_at');
    
    console.log(`   Total integrations: ${integrations?.length || 0}`);
    if (intError) console.log(`   Error: ${intError.message}`);
    if (integrations && integrations.length > 0) {
      console.log(`   Sample integration:`, integrations[0]);
    }
    
    // Test user_sessions query
    console.log('\n🟢 Testing User Sessions...');
    const { data: sessions, error: sessionError } = await supabase
      .from('user_sessions')
      .select('id, user_id, is_active')
      .eq('is_active', true);
    
    console.log(`   Active sessions: ${sessions?.length || 0}`);
    if (sessionError) console.log(`   Error: ${sessionError.message}`);
    if (sessions && sessions.length > 0) {
      console.log(`   Sample session:`, sessions[0]);
    }
    
    // Calculate analytics metrics
    console.log('\n📈 Calculated Analytics Metrics:');
    const uniqueUsers = new Set(conversations?.map(c => c.phone_number) || []).size;
    const totalConversations = conversations?.length || 0;
    const avgConversationsPerUser = uniqueUsers > 0 ? Math.round(totalConversations / uniqueUsers) : 0;
    
    console.log(`   Unique users (by phone): ${uniqueUsers}`);
    console.log(`   Total conversations: ${totalConversations}`);
    console.log(`   Avg conversations per user: ${avgConversationsPerUser}`);
    console.log(`   Active sessions: ${sessions?.length || 0}`);
    
  } catch (err) {
    console.log(`❌ Test error: ${err.message}`);
  }

  console.log('\n✅ Analytics test completed!');
}

// Run the test
testAnalytics().catch(console.error); 