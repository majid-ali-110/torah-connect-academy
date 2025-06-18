-- Create tables for the learning platform functionality

-- 1. Update profiles table to include trial lesson tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_lessons_used INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS max_trial_lessons INTEGER DEFAULT 2;

-- 2. Create conversations table for chat functionality
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, teacher_id)
);

-- 3. Create chat_messages table for individual messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'meeting_request', 'meeting_response')),
  meeting_data JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create a course_sessions table for tracking individual class sessions
CREATE TABLE IF NOT EXISTS public.course_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  session_type TEXT NOT NULL DEFAULT 'regular' CHECK (session_type IN ('trial', 'regular')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create donations table for the "pay-it-forward" system
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- Amount in cents (EUR)
  donation_type TEXT NOT NULL CHECK (donation_type IN ('single_course', 'multiple_courses', 'custom')),
  courses_sponsored INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  tax_receipt_issued BOOLEAN DEFAULT FALSE,
  tax_receipt_number TEXT,
  message TEXT, -- Optional message from donor
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create sponsored_courses table to track which courses are sponsored
CREATE TABLE IF NOT EXISTS public.sponsored_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  beneficiary_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create teacher_hours table for tracking teaching hours
CREATE TABLE IF NOT EXISTS public.teacher_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.course_sessions(id) ON DELETE CASCADE,
  hours_taught DECIMAL(4,2) NOT NULL,
  date_taught DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Update courses table with additional fields
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS session_duration_minutes INTEGER DEFAULT 30;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 1;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_trial_available BOOLEAN DEFAULT TRUE;

-- 9. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON public.conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_teacher_id ON public.conversations(teacher_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_course_sessions_teacher_id ON public.course_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_student_id ON public.course_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_date ON public.course_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_sponsored_courses_beneficiary ON public.sponsored_courses(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_teacher_hours_teacher_id ON public.teacher_hours(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_hours_date ON public.teacher_hours(date_taught);

-- 10. Enable RLS on new tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsored_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_hours ENABLE ROW LEVEL SECURITY;

-- 11. Add RLS policies for conversations
CREATE POLICY "Users can view their conversations" 
ON public.conversations 
FOR SELECT 
USING (student_id = auth.uid() OR teacher_id = auth.uid());

CREATE POLICY "Users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (student_id = auth.uid() OR teacher_id = auth.uid());

CREATE POLICY "Users can update their conversations" 
ON public.conversations 
FOR UPDATE 
USING (student_id = auth.uid() OR teacher_id = auth.uid());

-- 12. Add RLS policies for chat_messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id 
    AND (student_id = auth.uid() OR teacher_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their conversations" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id 
    AND (student_id = auth.uid() OR teacher_id = auth.uid())
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.chat_messages 
FOR UPDATE 
USING (sender_id = auth.uid());

-- 13. Add RLS policies for course_sessions
CREATE POLICY "Users can view their course sessions" 
ON public.course_sessions 
FOR SELECT 
USING (teacher_id = auth.uid() OR student_id = auth.uid());

CREATE POLICY "Teachers can create sessions for their courses" 
ON public.course_sessions 
FOR INSERT 
WITH CHECK (teacher_id = auth.uid() AND EXISTS (
  SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid()
));

CREATE POLICY "Participants can update session status" 
ON public.course_sessions 
FOR UPDATE 
USING (teacher_id = auth.uid() OR student_id = auth.uid());

-- 14. Add RLS policies for donations
CREATE POLICY "Users can view their own donations" 
ON public.donations 
FOR SELECT 
USING (donor_id = auth.uid());

CREATE POLICY "Users can create donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (donor_id = auth.uid());

CREATE POLICY "Admins can view all donations" 
ON public.donations 
FOR SELECT 
USING (public.is_admin());

-- 15. Add RLS policies for sponsored_courses
CREATE POLICY "Beneficiaries can view their sponsored courses" 
ON public.sponsored_courses 
FOR SELECT 
USING (beneficiary_id = auth.uid());

CREATE POLICY "System can manage sponsored courses" 
ON public.sponsored_courses 
FOR ALL 
USING (public.is_admin());

-- 16. Add RLS policies for teacher_hours
CREATE POLICY "Teachers can view their own hours" 
ON public.teacher_hours 
FOR SELECT 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can log their hours" 
ON public.teacher_hours 
FOR INSERT 
WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Admins can view all teacher hours" 
ON public.teacher_hours 
FOR SELECT 
USING (public.is_admin());

-- 17. Create function to automatically create teacher hours when session is completed
CREATE OR REPLACE FUNCTION create_teacher_hours_on_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create hours record when session status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO public.teacher_hours (teacher_id, session_id, hours_taught, date_taught)
    VALUES (
      NEW.teacher_id,
      NEW.id,
      NEW.duration_minutes / 60.0,
      NEW.session_date::DATE
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 18. Create trigger for automatic teacher hours tracking
DROP TRIGGER IF EXISTS trigger_create_teacher_hours ON public.course_sessions;
CREATE TRIGGER trigger_create_teacher_hours
  AFTER UPDATE ON public.course_sessions
  FOR EACH ROW
  EXECUTE FUNCTION create_teacher_hours_on_completion();

-- 19. Create function to check available sponsored courses
CREATE OR REPLACE FUNCTION get_available_sponsored_courses(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.sponsored_courses sc
    WHERE sc.beneficiary_id IS NULL
    AND EXISTS (
      SELECT 1 FROM public.donations d 
      WHERE d.id = sc.donation_id 
      AND d.status = 'completed'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 20. Create function to assign sponsored course to user
CREATE OR REPLACE FUNCTION assign_sponsored_course(user_id UUID, course_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  sponsored_record UUID;
BEGIN
  -- Find an available sponsored course slot
  SELECT sc.id INTO sponsored_record
  FROM public.sponsored_courses sc
  WHERE sc.beneficiary_id IS NULL
  AND sc.course_id = course_id
  AND EXISTS (
    SELECT 1 FROM public.donations d 
    WHERE d.id = sc.donation_id 
    AND d.status = 'completed'
  )
  LIMIT 1;
  
  IF sponsored_record IS NOT NULL THEN
    UPDATE public.sponsored_courses 
    SET beneficiary_id = user_id, used_at = NOW()
    WHERE id = sponsored_record;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 21. Create live sessions table for live course functionality
CREATE TABLE IF NOT EXISTS live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  max_participants INTEGER NOT NULL DEFAULT 20,
  jitsi_room TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. Create live attendance table
CREATE TABLE IF NOT EXISTS live_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- 23. Create free trials table
CREATE TABLE IF NOT EXISTS free_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id, teacher_id)
);

-- 24. Add indexes for live session tables
CREATE INDEX IF NOT EXISTS idx_live_sessions_teacher_id ON live_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_course_id ON live_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_scheduled_at ON live_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_live_attendance_session_id ON live_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_live_attendance_student_id ON live_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_free_trials_student_id ON free_trials(student_id);
CREATE INDEX IF NOT EXISTS idx_free_trials_course_id ON free_trials(course_id);
CREATE INDEX IF NOT EXISTS idx_free_trials_teacher_id ON free_trials(teacher_id);

-- 25. Enable RLS on live session tables
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_trials ENABLE ROW LEVEL SECURITY;

-- 26. Add RLS policies for live sessions
CREATE POLICY "Teachers can manage their live sessions" 
ON live_sessions 
FOR ALL 
USING (teacher_id = auth.uid());

CREATE POLICY "Students can view live sessions" 
ON live_sessions 
FOR SELECT 
USING (true);

-- 27. Add RLS policies for live attendance
CREATE POLICY "Users can view their own attendance" 
ON live_attendance 
FOR SELECT 
USING (student_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM live_sessions WHERE id = session_id AND teacher_id = auth.uid())
);

CREATE POLICY "Students can join sessions" 
ON live_attendance 
FOR INSERT 
WITH CHECK (student_id = auth.uid());

-- 28. Add RLS policies for free trials
CREATE POLICY "Users can view their own free trials" 
ON free_trials 
FOR SELECT 
USING (student_id = auth.uid() OR teacher_id = auth.uid());

CREATE POLICY "Students can use free trials" 
ON free_trials 
FOR INSERT 
WITH CHECK (student_id = auth.uid());
