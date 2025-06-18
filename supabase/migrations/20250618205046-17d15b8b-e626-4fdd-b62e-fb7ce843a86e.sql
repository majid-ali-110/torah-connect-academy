
-- Add user role enum if not exists
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table with approval system
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create teacher_subjects table for approved subjects
CREATE TABLE IF NOT EXISTS public.teacher_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, subject)
);

-- Create trial_sessions table to track student trials
CREATE TABLE IF NOT EXISTS public.trial_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject)
);

-- Create payment_requests table for course enrollment
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
  stripe_session_id TEXT,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teacher_salary_settings table for admin to set percentages
CREATE TABLE IF NOT EXISTS public.teacher_salary_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_percentage DECIMAL(3,2) DEFAULT 0.70,
  admin_percentage DECIMAL(3,2) DEFAULT 0.30,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default salary settings
INSERT INTO public.teacher_salary_settings (teacher_percentage, admin_percentage)
VALUES (0.70, 0.30)
ON CONFLICT DO NOTHING;

-- Create monthly_teacher_payments table for tracking salary payments
CREATE TABLE IF NOT EXISTS public.monthly_teacher_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- Format: "2024-01"
  total_hours DECIMAL(10,2) NOT NULL,
  hourly_rate INTEGER NOT NULL,
  gross_amount INTEGER NOT NULL,
  teacher_amount INTEGER NOT NULL,
  admin_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid')),
  processed_by UUID REFERENCES public.profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, month_year)
);

-- Enable RLS on new tables
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_salary_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_teacher_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for teacher_subjects
CREATE POLICY "Teachers can view their approved subjects" ON public.teacher_subjects
FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Admins can manage teacher subjects" ON public.teacher_subjects
FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS policies for trial_sessions
CREATE POLICY "Students can view their trials" ON public.trial_sessions
FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view their trials" ON public.trial_sessions
FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Students can create trial sessions" ON public.trial_sessions
FOR INSERT WITH CHECK (student_id = auth.uid());

-- RLS policies for payment_requests
CREATE POLICY "Students can view their payment requests" ON public.payment_requests
FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "System can manage payment requests" ON public.payment_requests
FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS policies for teacher_salary_settings
CREATE POLICY "Admins can manage salary settings" ON public.teacher_salary_settings
FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Everyone can view salary settings" ON public.teacher_salary_settings
FOR SELECT USING (true);

-- RLS policies for monthly_teacher_payments
CREATE POLICY "Teachers can view their payments" ON public.monthly_teacher_payments
FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Admins can manage all payments" ON public.monthly_teacher_payments
FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to check if user has completed trial for subject
CREATE OR REPLACE FUNCTION public.has_trial_for_subject(user_id UUID, subject_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.trial_sessions 
    WHERE student_id = user_id AND subject = subject_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate monthly teacher payments
CREATE OR REPLACE FUNCTION public.calculate_monthly_teacher_payment(
  teacher_id_param UUID,
  month_year_param TEXT
)
RETURNS JSON AS $$
DECLARE
  total_hours DECIMAL(10,2);
  teacher_rate INTEGER;
  settings RECORD;
  gross_amount INTEGER;
  teacher_amount INTEGER;
  admin_amount INTEGER;
BEGIN
  -- Get teacher's hourly rate
  SELECT hourly_rate INTO teacher_rate
  FROM public.profiles 
  WHERE id = teacher_id_param;
  
  IF teacher_rate IS NULL THEN
    teacher_rate := 2500; -- Default 25 EUR per hour in cents
  END IF;
  
  -- Calculate total hours for the month
  SELECT COALESCE(SUM(hours_taught), 0) INTO total_hours
  FROM public.teacher_hours 
  WHERE teacher_id = teacher_id_param 
  AND to_char(date_taught, 'YYYY-MM') = month_year_param;
  
  -- Get salary settings
  SELECT * INTO settings
  FROM public.teacher_salary_settings 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- Calculate amounts
  gross_amount := (total_hours * teacher_rate)::INTEGER;
  teacher_amount := (gross_amount * settings.teacher_percentage)::INTEGER;
  admin_amount := (gross_amount * settings.admin_percentage)::INTEGER;
  
  RETURN json_build_object(
    'total_hours', total_hours,
    'hourly_rate', teacher_rate,
    'gross_amount', gross_amount,
    'teacher_amount', teacher_amount,
    'admin_amount', admin_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
