-- =====================================================
-- STEP 1: DELETE ENTIRE DATABASE
-- =====================================================
-- Drop all existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS forum_replies CASCADE;
DROP TABLE IF EXISTS discussion_forums CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS withdrawals CASCADE;
DROP TABLE IF EXISTS teacher_earnings CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS sponsored_courses CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS teacher_hours CASCADE;
DROP TABLE IF EXISTS live_class_enrollments CASCADE;
DROP TABLE IF EXISTS class_enrollments CASCADE;
DROP TABLE IF EXISTS live_classes CASCADE;
DROP TABLE IF EXISTS study_group_members CASCADE;
DROP TABLE IF EXISTS study_groups CASCADE;
DROP TABLE IF EXISTS course_sessions CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS lesson_bookings CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS admin_approvals CASCADE;
DROP TABLE IF EXISTS admin_actions CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS rabbis CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS message_type CASCADE;
DROP TYPE IF EXISTS session_status CASCADE;

-- Drop all policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Teachers can create courses" ON courses;
DROP POLICY IF EXISTS "Course sessions are viewable by participants" ON course_sessions;

-- Update database configuration for proper data flow

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rabbis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for teachers" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for subjects" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.courses;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subjects;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.teachers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.course_sessions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.study_groups;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.study_group_members;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.rabbis;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.live_classes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.live_class_enrollments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.discussion_forums;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.support_tickets;

-- Create new policies for anonymous access
CREATE POLICY "Enable read access for all users"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.courses
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.subjects
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.teachers
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.course_sessions
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.study_groups
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.study_group_members
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.rabbis
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.live_classes
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.live_class_enrollments
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.discussion_forums
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for all users"
ON public.support_tickets
FOR SELECT
USING (true);

-- Grant necessary permissions to anon role
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON public.subjects TO anon;
GRANT SELECT ON public.teachers TO anon;
GRANT SELECT ON public.course_sessions TO anon;
GRANT SELECT ON public.study_groups TO anon;
GRANT SELECT ON public.study_group_members TO anon;
GRANT SELECT ON public.rabbis TO anon;
GRANT SELECT ON public.live_classes TO anon;
GRANT SELECT ON public.live_class_enrollments TO anon;
GRANT SELECT ON public.discussion_forums TO anon;
GRANT SELECT ON public.support_tickets TO anon;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_subjects ON public.profiles USING GIN(subjects);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON public.courses(subject);
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON public.courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_course_id ON public.course_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_teacher_id ON public.course_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_student_id ON public.course_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_subject_id ON public.study_groups(subject_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_facilitator_id ON public.study_groups(facilitator_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_teacher_id ON public.live_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_live_class_enrollments_student_id ON public.live_class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_discussion_forums_subject_id ON public.discussion_forums(subject_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    -- Profiles table constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_approved_by_fkey') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(id);
    END IF;

    -- Courses table constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'courses_teacher_id_fkey') THEN
        ALTER TABLE public.courses ADD CONSTRAINT courses_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.profiles(id);
    END IF;

    -- Course sessions table constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'course_sessions_course_id_fkey') THEN
        ALTER TABLE public.course_sessions ADD CONSTRAINT course_sessions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'course_sessions_teacher_id_fkey') THEN
        ALTER TABLE public.course_sessions ADD CONSTRAINT course_sessions_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.profiles(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'course_sessions_student_id_fkey') THEN
        ALTER TABLE public.course_sessions ADD CONSTRAINT course_sessions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id);
    END IF;

    -- Study groups table constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'study_groups_subject_id_fkey') THEN
        ALTER TABLE public.study_groups ADD CONSTRAINT study_groups_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'study_groups_facilitator_id_fkey') THEN
        ALTER TABLE public.study_groups ADD CONSTRAINT study_groups_facilitator_id_fkey FOREIGN KEY (facilitator_id) REFERENCES public.profiles(id);
    END IF;

    -- Live classes table constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'live_classes_teacher_id_fkey') THEN
        ALTER TABLE public.live_classes ADD CONSTRAINT live_classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.profiles(id);
    END IF;

    -- Live class enrollments table constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'live_class_enrollments_student_id_fkey') THEN
        ALTER TABLE public.live_class_enrollments ADD CONSTRAINT live_class_enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'live_class_enrollments_live_class_id_fkey') THEN
        ALTER TABLE public.live_class_enrollments ADD CONSTRAINT live_class_enrollments_live_class_id_fkey FOREIGN KEY (live_class_id) REFERENCES public.live_classes(id);
    END IF;

    -- Discussion forums table constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'discussion_forums_subject_id_fkey') THEN
        ALTER TABLE public.discussion_forums ADD CONSTRAINT discussion_forums_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);
    END IF;

    -- Support tickets table constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'support_tickets_user_id_fkey') THEN
        ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);
    END IF;
END $$; 