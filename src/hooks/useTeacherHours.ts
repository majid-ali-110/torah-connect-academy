
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TeacherHours {
  id: string;
  teacher_id: string;
  session_id: string;
  hours_taught: number;
  date_taught: string;
  created_at: string;
  session?: {
    course?: {
      title: string;
      subject: string;
    };
    student?: {
      first_name: string;
      last_name: string;
    };
  };
}

export const useTeacherHours = (teacherId?: string) => {
  const [hours, setHours] = useState<TeacherHours[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeacherHours = async () => {
      if (!user && !teacherId) return;

      const targetTeacherId = teacherId || user?.id;
      if (!targetTeacherId) return;

      try {
        const { data, error } = await supabase
          .from('teacher_hours')
          .select(`
            *,
            course_sessions!inner(
              courses!inner(title, subject),
              profiles!course_sessions_student_id_fkey(first_name, last_name)
            )
          `)
          .eq('teacher_id', targetTeacherId)
          .order('date_taught', { ascending: false });

        if (error) throw error;

        const formattedHours = data.map(hour => ({
          ...hour,
          session: {
            course: hour.course_sessions.courses,
            student: hour.course_sessions.profiles
          }
        }));

        setHours(formattedHours);
        setTotalHours(data.reduce((sum, hour) => sum + hour.hours_taught, 0));
      } catch (error) {
        console.error('Error fetching teacher hours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherHours();
  }, [user?.id, teacherId]);

  return { hours, totalHours, loading };
};
