const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this from your Supabase dashboard

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Admin user credentials
    const adminEmail = 'admin@torahconnect.com';
    const adminPassword = 'Admin123!';
    
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
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('Auth user created successfully:', authData.user.id);

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
      console.error('Error creating profile:', profileError);
      return;
    }

    console.log('Profile created successfully:', profileData);
    
    console.log('\n=== ADMIN USER CREATED SUCCESSFULLY ===');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('User ID:', authData.user.id);
    console.log('Role: admin');
    console.log('\nYou can now login with these credentials!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser(); 