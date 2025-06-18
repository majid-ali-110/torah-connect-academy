
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - using the project details from your codebase
const supabaseUrl = 'https://gidsrdkwacpchbswjdho.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to set this

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('\n📋 To get your service role key:');
  console.log('1. Go to https://supabase.com/dashboard/project/gidsrdkwacpchbswjdho/settings/api');
  console.log('2. Copy the "service_role" key (not the anon key)');
  console.log('3. Set it as an environment variable: SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  console.log('4. Run: SUPABASE_SERVICE_ROLE_KEY=your_key_here node create-admin-final.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...\n');
    
    // Admin credentials for testing
    const adminEmail = 'admin@torahconnect.com';
    const adminPassword = 'Admin123!';
    
    // First, check if admin already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .eq('role', 'admin')
      .single();

    if (existingProfile) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      console.log('\n🌐 You can login at: http://localhost:8080/auth');
      return;
    }

    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User'
      }
    });

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message);
      return;
    }

    console.log('✅ Auth user created with ID:', authData.user.id);

    // Create the profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        approval_status: 'approved',
        approved_at: new Date().toISOString(),
        preferred_language: 'en',
        max_trial_lessons: 0,
        trial_lessons_used: 0
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message);
      return;
    }

    console.log('✅ Profile created successfully\n');
    
    console.log('🎉 ADMIN USER CREATED SUCCESSFULLY!');
    console.log('================================');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role: Admin');
    console.log('🆔 User ID:', authData.user.id);
    console.log('\n🌐 Login URL: http://localhost:8080/auth');
    console.log('\n📝 Instructions:');
    console.log('1. Go to the login page');
    console.log('2. Use the credentials above');
    console.log('3. You will be redirected to the admin dashboard');

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

// Run the script
createAdminUser();
