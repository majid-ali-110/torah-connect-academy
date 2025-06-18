// Simple script to create admin user
// This script provides the SQL commands and instructions

console.log('=== ADMIN USER CREATION SCRIPT ===\n');

console.log('OPTION 1: Manual Creation via Supabase Dashboard');
console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
console.log('2. Select your project: gidsrdkwacpchbswjdho');
console.log('3. Go to Authentication > Users');
console.log('4. Click "Add User"');
console.log('5. Enter the following details:');
console.log('   - Email: admin@torahconnect.com');
console.log('   - Password: Admin123!');
console.log('   - Check "Email confirmed"');
console.log('6. Click "Create User"');
console.log('7. Copy the User ID (UUID) that is generated\n');

console.log('OPTION 2: SQL Commands (Run in Supabase SQL Editor)');
console.log('After creating the auth user above, run this SQL:');

const sqlCommands = `
-- Replace 'USER_UUID_HERE' with the actual UUID from step 7 above
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  approval_status,
  approved_at,
  created_at,
  updated_at,
  preferred_language,
  max_trial_lessons,
  trial_lessons_used
) VALUES (
  'USER_UUID_HERE', -- Replace with actual UUID
  'admin@torahconnect.com',
  'Admin',
  'User',
  'admin',
  'approved',
  NOW(),
  NOW(),
  NOW(),
  'en',
  0,
  0
);

-- Verify the admin user was created
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  approval_status,
  created_at
FROM public.profiles 
WHERE email = 'admin@torahconnect.com' 
AND role = 'admin';
`;

console.log(sqlCommands);

console.log('\n=== LOGIN CREDENTIALS ===');
console.log('Email: admin@torahconnect.com');
console.log('Password: Admin123!');
console.log('Role: admin');
console.log('\nAfter completing the steps above, you can login to the application!'); 