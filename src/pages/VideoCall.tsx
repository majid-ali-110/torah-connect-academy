
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import JitsiMeeting from '@/components/video/JitsiMeeting';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const VideoCall: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [meetingData, setMeetingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roomId && user) {
      fetchMeetingData();
    }
  }, [roomId, user]);

  const fetchMeetingData = async () => {
    if (!roomId || !user) return;

    try {
      // Check if this is from a lesson booking
      const { data: booking, error: bookingError } = await supabase
        .from('lesson_bookings')
        .select(`
          *,
          teacher:profiles!lesson_bookings_teacher_id_fkey(first_name, last_name),
          student:profiles!lesson_bookings_student_id_fkey(first_name, last_name)
        `)
        .eq('id', roomId)
        .single();

      if (booking && !bookingError) {
        setMeetingData({
          roomId: roomId,
          teacherId: booking.teacher_id,
          studentId: booking.student_id,
          subject: booking.subject,
          teacher: booking.teacher,
          student: booking.student
        });
      } else {
        // If not a lesson booking, create a generic meeting
        setMeetingData({
          roomId: roomId,
          teacherId: profile?.role === 'teacher' ? user.id : '',
          studentId: profile?.role === 'student' ? user.id : '',
          subject: 'General Session'
        });
      }
    } catch (error) {
      console.error('Error fetching meeting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndMeeting = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  if (!meetingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Meeting not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <JitsiMeeting
          roomId={meetingData.roomId}
          teacherId={meetingData.teacherId}
          studentId={meetingData.studentId}
          subject={meetingData.subject}
          onEndMeeting={handleEndMeeting}
        />
      </div>
    </div>
  );
};

export default VideoCall;
