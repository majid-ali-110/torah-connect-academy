-- Fix RLS policies for anonymous access

-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for teachers" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for subjects" ON public.profiles;

-- Create new policies for anonymous access
CREATE POLICY "Enable read access for all users"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for teachers"
ON public.profiles
FOR SELECT
USING (role = 'teacher');

CREATE POLICY "Enable read access for subjects"
ON public.profiles
FOR SELECT
USING (subjects IS NOT NULL);

-- Create policy for courses table
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.courses;

CREATE POLICY "Enable read access for all users"
ON public.courses
FOR SELECT
USING (true);

-- Create policy for subjects table
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.subjects;

CREATE POLICY "Enable read access for all users"
ON public.subjects
FOR SELECT
USING (true);

-- Grant necessary permissions to anon role
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON public.subjects TO anon;
GRANT SELECT ON public.teachers TO anon;
GRANT SELECT ON public.teacher_hours TO anon;
GRANT SELECT ON public.course_sessions TO anon;
GRANT SELECT ON public.donations TO anon;
GRANT SELECT ON public.sponsored_courses TO anon; 