
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  action_type: string;
  admin_id: string;
  target_user_id: string | null;
  details: any;
  created_at: string;
}

const SecurityAuditLog: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching security events:', error);
      toast.error('Failed to load security audit log');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSecurityEvents();
  };

  const getEventIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'login_attempt':
        return <Shield className="w-4 h-4" />;
      case 'data_access':
        return <Eye className="w-4 h-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getEventBadgeColor = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'login_attempt':
        return 'bg-blue-100 text-blue-800';
      case 'data_access':
        return 'bg-green-100 text-green-800';
      case 'suspicious_activity':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-torah-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Audit Log
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No security events recorded yet
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0 mt-1">
                  {getEventIcon(event.action_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={getEventBadgeColor(event.action_type)}>
                      {event.action_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(event.created_at)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-900">
                    Admin ID: {event.admin_id.substring(0, 8)}...
                    {event.target_user_id && (
                      <span className="ml-2">
                        Target: {event.target_user_id.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                  {event.details && (
                    <div className="text-xs text-gray-600 mt-1">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    </div>
                  )}
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
