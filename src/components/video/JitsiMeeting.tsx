
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface JitsiMeetingProps {
  roomId: string;
  teacherId: string;
  studentId: string;
  subject?: string;
  onEndMeeting?: () => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
  roomId,
  teacherId,
  studentId,
  subject,
  onEndMeeting
}) => {
  const { user, profile } = useAuth();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJitsiScript = () => {
      return new Promise((resolve) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.onload = () => resolve(true);
        document.head.appendChild(script);
      });
    };

    const initializeJitsi = async () => {
      try {
        await loadJitsiScript();
        
        if (!jitsiContainerRef.current || !user || !profile) return;

        const domain = 'meet.jit.si';
        const options = {
          roomName: roomId,
          width: '100%',
          height: 600,
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: `${profile.first_name} ${profile.last_name}`,
            email: profile.email
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat',
              'recording', 'livestreaming', 'etherpad', 'sharedvideo',
              'settings', 'raisehand', 'videoquality', 'filmstrip',
              'invite', 'feedback', 'stats', 'shortcuts', 'tileview'
            ],
          }
        };

        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        // Start study session when meeting starts
        jitsiApiRef.current.addEventListener('videoConferenceJoined', async () => {
          console.log('Video conference joined');
          await startStudySession();
          setIsLoading(false);
        });

        // End study session when meeting ends
        jitsiApiRef.current.addEventListener('videoConferenceLeft', async () => {
          console.log('Video conference left');
          await endStudySession();
          if (onEndMeeting) {
            onEndMeeting();
          }
        });

      } catch (error) {
        console.error('Error initializing Jitsi:', error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to initialize video call",
          variant: "destructive"
        });
      }
    };

    initializeJitsi();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, [roomId, user, profile]);

  const startStudySession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([{
          teacher_id: teacherId,
          student_id: studentId,
          room_id: roomId,
          subject: subject,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setSessionStartTime(new Date());
      
      console.log('Study session started:', data.id);
    } catch (error) {
      console.error('Error starting study session:', error);
    }
  };

  const endStudySession = async () => {
    if (!sessionId || !sessionStartTime) return;

    try {
      const endTime = new Date();
      const durationMinutes = Math.round((endTime.getTime() - sessionStartTime.getTime()) / (1000 * 60));

      const { error } = await supabase
        .from('study_sessions')
        .update({
          ended_at: endTime.toISOString(),
          duration_minutes: durationMinutes,
          status: 'completed'
        })
        .eq('id', sessionId);

      if (error) throw error;

      console.log('Study session ended:', sessionId, 'Duration:', durationMinutes, 'minutes');
      
      toast({
        title: "Session Completed",
        description: `Study session completed. Duration: ${durationMinutes} minutes`,
      });
    } catch (error) {
      console.error('Error ending study session:', error);
    }
  };

  const endMeeting = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Video Call Session</h3>
          <p className="text-sm text-gray-600">
            Room: {roomId} | Subject: {subject || 'General'}
          </p>
        </div>
        <Button
          onClick={endMeeting}
          variant="destructive"
          size="sm"
        >
          End Meeting
        </Button>
      </div>
      
      <div 
        ref={jitsiContainerRef}
        className="w-full rounded-lg overflow-hidden border border-gray-200"
        style={{ height: '600px' }}
      />
    </div>
  );
};

export default JitsiMeeting;
