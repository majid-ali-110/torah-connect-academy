-- Temporary script to create an admin user
-- Run this in your Supabase SQL editor

-- First, create the auth user (this needs to be done via Supabase Auth API or dashboard)
-- For now, we'll create the profile and you can create the auth user manually

-- Insert admin user into profiles table
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
  gen_random_uuid(), -- Generate a new UUID for the admin
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

-- Get the admin user ID for reference
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

-- IMPORTANT: You need to create the auth user manually in Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Enter email: admin@torahconnect.com
-- 4. Enter password: Admin123!
-- 5. Set email confirmed to true
-- 6. Copy the UUID from the SELECT query above and update the profiles.id
-- 7. Run this update query with the actual UUID:

-- UPDATE public.profiles 
-- SET id = 'PASTE_THE_AUTH_USER_UUID_HERE'
-- WHERE email = 'admin@torahconnect.com' 
-- AND role = 'admin'; 