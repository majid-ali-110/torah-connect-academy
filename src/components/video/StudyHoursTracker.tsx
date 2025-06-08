
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Calendar, TrendingUp } from 'lucide-react';

interface StudyHours {
  total_minutes: number;
  last_session_date: string | null;
}

const StudyHoursTracker: React.FC = () => {
  const { user } = useAuth();
  const [studyHours, setStudyHours] = useState<StudyHours | null>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudyHours();
      fetchRecentSessions();
    }
  }, [user]);

  const fetchStudyHours = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_hours')
        .select('total_minutes, last_session_date')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setStudyHours(data || { total_minutes: 0, last_session_date: null });
    } catch (error) {
      console.error('Error fetching study hours:', error);
      setStudyHours({ total_minutes: 0, last_session_date: null });
    }
  };

  const fetchRecentSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select(`
          id,
          started_at,
          ended_at,
          duration_minutes,
          subject,
          status,
          teacher_id,
          student_id,
          teacher:profiles!study_sessions_teacher_id_fkey(first_name, last_name),
          student:profiles!study_sessions_student_id_fkey(first_name, last_name)
        `)
        .or(`teacher_id.eq.${user.id},student_id.eq.${user.id}`)
        .eq('status', 'completed')
        .order('ended_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setRecentSessions(data || []);
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Study Hours Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studyHours ? formatDuration(studyHours.total_minutes) : '0h 0m'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Session</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studyHours?.last_session_date 
                ? formatDate(studyHours.last_session_date)
                : 'No sessions yet'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSessions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No study sessions yet</p>
          ) : (
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{session.subject || 'General Study'}</h4>
                    <p className="text-sm text-gray-600">
                      with {session.teacher_id === user?.id 
                        ? `${session.student.first_name} ${session.student.last_name}` 
                        : `${session.teacher.first_name} ${session.teacher.last_name}`
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(session.ended_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatDuration(session.duration_minutes || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyHoursTracker;
