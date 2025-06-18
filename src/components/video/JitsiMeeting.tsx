import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Mic, MicOff, VideoOff, Phone, Settings } from 'lucide-react';

// Global type declaration for Jitsi Meet API
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface JitsiMeetingProps {
  roomName: string;
  onLeave?: () => void;
}

const JitsiMeeting: React.FC<JitsiMeetingProps> = ({ roomName, onLeave }) => {
  const { profile } = useAuth();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  useEffect(() => {
    // Load Jitsi Meet external API
    const loadJitsiScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Jitsi Meet API'));
        document.head.appendChild(script);
      });
    };

    const initializeJitsi = async () => {
      try {
        await loadJitsiScript();

        if (!jitsiContainerRef.current) return;

        const domain = 'meet.jit.si';
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: profile ? `${profile.first_name} ${profile.last_name}` : 'Student',
            email: profile?.email || ''
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            toolbarButtons: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
            ],
            settings: {
              language: 'en'
            }
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_POWERED_BY: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_PROMOTIONAL_SPLASH: false,
            AUTHENTICATION_ENABLE: false,
            TOOLBAR_ALWAYS_VISIBLE: true,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
            ]
          }
        };

        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        // Event listeners
        jitsiApiRef.current.addEventListeners({
          readyToClose: handleClose,
          participantLeft: handleParticipantLeft,
          participantJoined: handleParticipantJoined,
          videoConferenceJoined: handleVideoConferenceJoined,
          videoConferenceLeft: handleVideoConferenceLeft
        });

      } catch (error) {
        console.error('Error initializing Jitsi Meet:', error);
      }
    };

    initializeJitsi();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, [roomName, profile]);

  const handleClose = () => {
    if (onLeave) {
      onLeave();
    }
  };

  const handleParticipantLeft = (participant: any) => {
    console.log('Participant left:', participant);
  };

  const handleParticipantJoined = (participant: any) => {
    console.log('Participant joined:', participant);
  };

  const handleVideoConferenceJoined = (participant: any) => {
    console.log('You joined the conference:', participant);
  };

  const handleVideoConferenceLeft = (participant: any) => {
    console.log('You left the conference:', participant);
  };

  const handleLeave = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup');
    }
    if (onLeave) {
      onLeave();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Video className="w-6 h-6 text-torah-500 mr-2" />
          <h1 className="text-lg font-semibold">Live Session</h1>
          <span className="ml-2 text-sm text-gray-500">Room: {roomName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLeave}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Phone className="w-4 h-4 mr-1" />
            Leave Session
          </Button>
        </div>
      </div>

      {/* Jitsi Container */}
      <div className="flex-1 relative">
        <div
          ref={jitsiContainerRef}
          className="w-full h-full"
          style={{ minHeight: '600px' }}
        />
      </div>

      {/* Loading State */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75" style={{ display: 'none' }}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Connecting to session...</p>
        </div>
      </div>
    </div>
  );
};

export default JitsiMeeting;
