
-- Create tables for the learning platform functionality

-- 1. Update profiles table to include trial lesson tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_lessons_used INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS max_trial_lessons INTEGER DEFAULT 2;

-- 2. Create a course_sessions table for tracking individual class sessions
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

-- 3. Create donations table for the "pay-it-forward" system
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

-- 4. Create sponsored_courses table to track which courses are sponsored
CREATE TABLE IF NOT EXISTS public.sponsored_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  beneficiary_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create teacher_hours table for tracking teaching hours
CREATE TABLE IF NOT EXISTS public.teacher_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.course_sessions(id) ON DELETE CASCADE,
  hours_taught DECIMAL(4,2) NOT NULL,
  date_taught DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Update courses table with additional fields
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS session_duration_minutes INTEGER DEFAULT 30;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 1;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_trial_available BOOLEAN DEFAULT TRUE;

-- 7. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_sessions_teacher_id ON public.course_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_student_id ON public.course_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_date ON public.course_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_sponsored_courses_beneficiary ON public.sponsored_courses(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_teacher_hours_teacher_id ON public.teacher_hours(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_hours_date ON public.teacher_hours(date_taught);

-- 8. Enable RLS on new tables
ALTER TABLE public.course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsored_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_hours ENABLE ROW LEVEL SECURITY;

-- 9. Add RLS policies for course_sessions
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

-- 10. Add RLS policies for donations
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

-- 11. Add RLS policies for sponsored_courses
CREATE POLICY "Beneficiaries can view their sponsored courses" 
ON public.sponsored_courses 
FOR SELECT 
USING (beneficiary_id = auth.uid());

CREATE POLICY "System can manage sponsored courses" 
ON public.sponsored_courses 
FOR ALL 
USING (public.is_admin());

-- 12. Add RLS policies for teacher_hours
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

-- 13. Create function to automatically create teacher hours when session is completed
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

-- 14. Create trigger for automatic teacher hours tracking
DROP TRIGGER IF EXISTS trigger_create_teacher_hours ON public.course_sessions;
CREATE TRIGGER trigger_create_teacher_hours
  AFTER UPDATE ON public.course_sessions
  FOR EACH ROW
  EXECUTE FUNCTION create_teacher_hours_on_completion();

-- 15. Create function to check available sponsored courses
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

-- 16. Create function to assign sponsored course to user
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
