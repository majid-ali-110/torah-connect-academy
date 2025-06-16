-- COMPLETE DATABASE RESET AND REBUILD
-- This script will drop all existing tables and recreate them with proper structure

-- Step 1: Drop all existing tables (in reverse order of dependencies)
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

-- Step 2: Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS message_type CASCADE;
DROP TYPE IF EXISTS session_status CASCADE;

-- Step 3: Create custom types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE message_type AS ENUM ('text', 'meeting_request', 'meeting_confirmation');
CREATE TYPE session_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');

-- Step 4: Create tables with proper structure

-- Profiles table (core user table)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role user_role DEFAULT 'student',
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    location TEXT,
    time_zone TEXT DEFAULT 'UTC',
    preferred_language TEXT DEFAULT 'en',
    subjects TEXT[],
    languages TEXT[],
    education TEXT[],
    experience TEXT,
    hourly_rate DECIMAL(10,2),
    age_group TEXT,
    gender TEXT,
    learning_level TEXT,
    audiences TEXT[],
    availability_status TEXT DEFAULT 'available',
    approval_status TEXT DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID,
    is_fallback BOOLEAN DEFAULT false,
    trial_lessons_used INTEGER DEFAULT 0,
    max_trial_lessons INTEGER DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    hebrew_name TEXT,
    category TEXT,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    specializations TEXT[],
    certifications TEXT[],
    teaching_languages TEXT[],
    availability JSONB,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    audience TEXT DEFAULT 'all',
    age_range TEXT,
    max_students INTEGER DEFAULT 1,
    session_duration_minutes INTEGER DEFAULT 30,
    total_sessions INTEGER DEFAULT 1,
    is_trial_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course sessions table
CREATE TABLE course_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    session_type TEXT DEFAULT 'regular' CHECK (session_type IN ('trial', 'regular')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rabbis table
CREATE TABLE rabbis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    image_url TEXT,
    specialties TEXT[],
    location TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    experience_years INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study groups table
CREATE TABLE study_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    facilitator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,
    schedule JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study group members table
CREATE TABLE study_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, member_id)
);

-- Live classes table
CREATE TABLE live_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_key TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    max_participants INTEGER DEFAULT 50,
    enrolled_count INTEGER DEFAULT 0,
    meeting_link TEXT NOT NULL,
    price DECIMAL(10,2),
    is_free BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, teacher_id)
);

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    meeting_data JSONB,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion forums table
CREATE TABLE discussion_forums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    tags TEXT[],
    views_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    donation_type TEXT CHECK (donation_type IN ('single_course', 'multiple_courses', 'custom')),
    courses_sponsored INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    stripe_payment_intent_id TEXT,
    tax_receipt_issued BOOLEAN DEFAULT false,
    tax_receipt_number TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional tables for completeness
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, student_id)
);

CREATE TABLE live_class_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_class_id UUID REFERENCES live_classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(live_class_id, student_id)
);

CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_courses_subject ON courses(subject);
CREATE INDEX idx_course_sessions_date ON course_sessions(session_date);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_study_groups_subject ON study_groups(subject_id);

-- Step 6: Enable Row Level Security (but with proper policies)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Step 7: Create simple RLS policies (avoiding recursion)
-- Allow everyone to read profiles (no recursion)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow everyone to read courses
CREATE POLICY "Courses are viewable by everyone" ON courses
    FOR SELECT USING (true);

-- Allow teachers to create courses
CREATE POLICY "Teachers can create courses" ON courses
    FOR INSERT WITH CHECK (auth.uid() = teacher_id);

-- Allow everyone to read course sessions
CREATE POLICY "Course sessions are viewable by participants" ON course_sessions
    FOR SELECT USING (
        auth.uid() = teacher_id OR 
        auth.uid() = student_id OR
        true -- For now, allow all to read
    );

-- Step 8: Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon; 