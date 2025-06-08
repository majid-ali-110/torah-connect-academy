
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecurityEvent {
  id: string;
  event_type: 'login' | 'logout' | 'profile_update' | 'password_change';
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failed' | 'suspicious';
}

const SecurityAuditLog: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would typically fetch from a security audit table
    // For now, we'll show mock data to demonstrate the concept
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        event_type: 'login',
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      {
        id: '2',
        event_type: 'profile_update',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'success'
      }
    ];
    
    setEvents(mockEvents);
    setLoading(false);
  }, [user]);

  const getEventIcon = (event: SecurityEvent) => {
    switch (event.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatEventType = (eventType: string): string => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading security events...</div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getEventIcon(event)}
                  <div>
                    <div className="font-medium">
                      {formatEventType(event.event_type)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  event.status === 'success' ? 'text-green-600' :
                  event.status === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;
