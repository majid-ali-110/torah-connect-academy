import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JitsiMeeting from '@/components/video/JitsiMeeting';

const LiveSession: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const navigate = useNavigate();

  const handleLeave = () => {
    navigate('/dashboard');
  };

  if (!roomName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Session</h1>
          <p className="text-gray-600 mb-6">The session room could not be found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-torah-500 text-white px-4 py-2 rounded-lg hover:bg-torah-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <JitsiMeeting roomName={roomName} onLeave={handleLeave} />;
};

export default LiveSession; 