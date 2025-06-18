import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Clock, Users, Video, AlertCircle, CheckCircle } from 'lucide-react';

interface LiveSession {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  max_participants: number;
  jitsi_room: string;
  course: {
    id: string;
    title: string;
    subject: string;
  };
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface JoinCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
}

const JoinCourseModal: React.FC<JoinCourseModalProps> = ({
  isOpen,
  onClose,
  sessionId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [eligibility, setEligibility] = useState<{
    isEnrolled: boolean;
    hasFreeTrial: boolean;
    canJoin: boolean;
    reason?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && sessionId) {
      fetchSessionDetails();
    }
  }, [isOpen, sessionId]);

  const fetchSessionDetails = async () => {
    if (!sessionId || !user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          id,
          title,
          description,
          scheduled_at,
          duration_minutes,
          max_participants,
          jitsi_room,
          course:courses(
            id,
            title,
            subject
          ),
          teacher:profiles!live_sessions_teacher_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      setSession(data);
      
      // Check eligibility
      await checkEligibility(data);
    } catch (error) {
      console.error('Error fetching session:', error);
      toast({
        title: 'Error',
        description: 'Failed to load session details.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (sessionData: LiveSession) => {
    if (!user) return;

    try {
      // Check if student is enrolled in the course
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', sessionData.course.id)
        .eq('student_id', user.id)
        .single();

      const isEnrolled = !!enrollment;

      // Check free trial usage for this course and teacher
      const { data: freeTrials } = await supabase
        .from('free_trials')
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', sessionData.course.id)
        .eq('teacher_id', sessionData.teacher.id);

      const hasFreeTrial = !freeTrials || freeTrials.length === 0;

      const canJoin = isEnrolled || hasFreeTrial;
      const reason = !canJoin 
        ? 'You have already used your free trial for this course with this teacher.'
        : !isEnrolled 
        ? 'You are using your free trial for this session.'
        : 'You are enrolled in this course.';

      setEligibility({
        isEnrolled,
        hasFreeTrial,
        canJoin,
        reason
      });
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const handleJoinSession = async () => {
    if (!user || !session) return;
    
    setJoining(true);
    try {
      // Record attendance
      const { error: attendanceError } = await supabase
        .from('live_attendance')
        .insert({
          session_id: session.id,
          student_id: user.id,
          joined_at: new Date().toISOString()
        });

      if (attendanceError) throw attendanceError;

      // If using free trial, record it
      if (eligibility?.hasFreeTrial && !eligibility?.isEnrolled) {
        const { error: trialError } = await supabase
          .from('free_trials')
          .insert({
            student_id: user.id,
            course_id: session.course.id,
            teacher_id: session.teacher.id,
            used_at: new Date().toISOString()
          });

        if (trialError) throw trialError;
      }

      toast({
        title: 'Success',
        description: 'You have joined the live session!',
      });

      // Redirect to Jitsi room
      window.open(`/live-session/${session.jitsi_room}`, '_blank');
      onClose();
    } catch (error) {
      console.error('Error joining session:', error);
      toast({
        title: 'Error',
        description: 'Failed to join session. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-torah-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!session) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Session not found.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Video className="mr-2 h-5 w-5" />
            Join Live Session
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{session.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{session.course.subject}</Badge>
                <Badge variant="secondary">{session.course.title}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.description && (
                <p className="text-gray-600">{session.description}</p>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                  <span>
                    {new Date(session.scheduled_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{session.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Max {session.max_participants} students</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500">Teacher:</span>
                  <span className="ml-1">
                    {session.teacher.first_name} {session.teacher.last_name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {eligibility && (
            <div className={`p-4 rounded-lg border ${
              eligibility.canJoin 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start">
                {eligibility.canJoin ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${
                    eligibility.canJoin ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {eligibility.canJoin ? 'You can join this session!' : 'Cannot join this session'}
                  </p>
                  <p className={`text-sm ${
                    eligibility.canJoin ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {eligibility.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleJoinSession}
              disabled={!eligibility?.canJoin || joining}
              className="bg-torah-500 hover:bg-torah-600"
            >
              {joining ? 'Joining...' : 'Join Session'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCourseModal;
