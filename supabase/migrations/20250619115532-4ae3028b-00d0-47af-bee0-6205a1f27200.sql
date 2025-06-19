
-- Add missing tables that are referenced in the code
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_class_id UUID REFERENCES public.live_classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  max_participants INTEGER NOT NULL DEFAULT 20,
  meeting_link TEXT NOT NULL,
  course_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.live_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_session_id UUID REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(live_session_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.free_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  UNIQUE(student_id, course_id, teacher_id)
);

-- Enable RLS on new tables
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_trials ENABLE ROW LEVEL SECURITY;

-- Drop and recreate all policies to avoid conflicts

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can view student profiles for their courses" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Teachers can view student profiles for their courses" ON public.profiles
  FOR SELECT USING (
    role = 'student' AND EXISTS (
      SELECT 1 FROM public.courses c 
      WHERE c.teacher_id = auth.uid()
    )
  );

-- Courses policies
DROP POLICY IF EXISTS "Anyone can view active courses" ON public.courses;
DROP POLICY IF EXISTS "Teachers can manage their courses" ON public.courses;

CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can manage their courses" ON public.courses
  FOR ALL USING (teacher_id = auth.uid());

-- Course sessions policies
DROP POLICY IF EXISTS "Users can view their course sessions" ON public.course_sessions;
DROP POLICY IF EXISTS "Teachers can create sessions for their courses" ON public.course_sessions;
DROP POLICY IF EXISTS "Participants can update session status" ON public.course_sessions;

CREATE POLICY "Users can view their course sessions" ON public.course_sessions
  FOR SELECT USING (teacher_id = auth.uid() OR student_id = auth.uid());

CREATE POLICY "Teachers can create sessions for their courses" ON public.course_sessions
  FOR INSERT WITH CHECK (
    teacher_id = auth.uid() AND EXISTS (
      SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid()
    )
  );

CREATE POLICY "Participants can update session status" ON public.course_sessions
  FOR UPDATE USING (teacher_id = auth.uid() OR student_id = auth.uid());

-- Live classes policies
DROP POLICY IF EXISTS "Anyone can view live classes" ON public.live_classes;
DROP POLICY IF EXISTS "Teachers can manage their live classes" ON public.live_classes;

CREATE POLICY "Anyone can view live classes" ON public.live_classes
  FOR SELECT USING (true);

CREATE POLICY "Teachers can manage their live classes" ON public.live_classes
  FOR ALL USING (teacher_id = auth.uid());

-- Live class enrollments policies
DROP POLICY IF EXISTS "Users can view their enrollments" ON public.live_class_enrollments;
DROP POLICY IF EXISTS "Students can enroll in classes" ON public.live_class_enrollments;

CREATE POLICY "Users can view their enrollments" ON public.live_class_enrollments
  FOR SELECT USING (
    student_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.live_classes WHERE id = live_class_id AND teacher_id = auth.uid())
  );

CREATE POLICY "Students can enroll in classes" ON public.live_class_enrollments
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Live sessions policies (new tables)
CREATE POLICY "Anyone can view live sessions" ON public.live_sessions
  FOR SELECT USING (true);

CREATE POLICY "Teachers can manage their live sessions" ON public.live_sessions
  FOR ALL USING (teacher_id = auth.uid());

-- Live attendance policies (new tables)
CREATE POLICY "Users can view their attendance" ON public.live_attendance
  FOR SELECT USING (
    student_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.live_sessions WHERE id = live_session_id AND teacher_id = auth.uid())
  );

CREATE POLICY "Students can join sessions" ON public.live_attendance
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Free trials policies (new tables)
CREATE POLICY "Users can view their free trials" ON public.free_trials
  FOR SELECT USING (student_id = auth.uid() OR teacher_id = auth.uid());

CREATE POLICY "Students can use free trials" ON public.free_trials
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Payments policies
DROP POLICY IF EXISTS "Users can view their payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;

CREATE POLICY "Users can view their payments" ON public.payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create payments" ON public.payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Donations policies (drop existing ones first)
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Users can create donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;

CREATE POLICY "Users can view their own donations" ON public.donations
  FOR SELECT USING (donor_id = auth.uid());

CREATE POLICY "Users can create donations" ON public.donations
  FOR INSERT WITH CHECK (donor_id = auth.uid());

CREATE POLICY "Admins can view all donations" ON public.donations
  FOR SELECT USING (public.is_admin());

-- Teacher hours policies (drop existing ones first)
DROP POLICY IF EXISTS "Teachers can view their own hours" ON public.teacher_hours;
DROP POLICY IF EXISTS "Teachers can log their hours" ON public.teacher_hours;
DROP POLICY IF EXISTS "Admins can view all teacher hours" ON public.teacher_hours;

CREATE POLICY "Teachers can view their own hours" ON public.teacher_hours
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can log their hours" ON public.teacher_hours
  FOR INSERT WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Admins can view all teacher hours" ON public.teacher_hours
  FOR SELECT USING (public.is_admin());

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_live_sessions_teacher_id ON public.live_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_scheduled_at ON public.live_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_live_attendance_session_id ON public.live_attendance(live_session_id);
CREATE INDEX IF NOT EXISTS idx_live_attendance_student_id ON public.live_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_free_trials_student_id ON public.free_trials(student_id);
CREATE INDEX IF NOT EXISTS idx_free_trials_course_id ON public.free_trials(course_id);
CREATE INDEX IF NOT EXISTS idx_free_trials_teacher_id ON public.free_trials(teacher_id);

-- Add trigger to update conversations updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations 
  SET updated_at = NOW() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON public.chat_messages;
CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Add function to check if user has used trial for specific subject
CREATE OR REPLACE FUNCTION public.has_used_trial_for_subject(user_id UUID, subject_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.free_trials 
    WHERE student_id = user_id AND subject = subject_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
