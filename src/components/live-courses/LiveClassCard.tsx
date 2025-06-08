
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Video, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  teacher_id: string;
  course_key: string;
  meeting_link: string;
  scheduled_at: string;
  duration_minutes: number;
  max_participants: number;
  created_at: string;
  teacher_name: string;
}

interface LiveClassCardProps {
  liveClass: LiveClass;
  userRole: string;
  onUpdate: () => void;
}

const LiveClassCard: React.FC<LiveClassCardProps> = ({ liveClass, userRole, onUpdate }) => {
  const { toast } = useToast();

  const getClassStatus = () => {
    const now = new Date();
    const scheduledTime = new Date(liveClass.scheduled_at);
    const endTime = new Date(scheduledTime.getTime() + liveClass.duration_minutes * 60000);

    if (now < scheduledTime) {
      return { status: 'upcoming', color: 'bg-blue-500' };
    } else if (now >= scheduledTime && now <= endTime) {
      return { status: 'live', color: 'bg-red-500' };
    } else {
      return { status: 'ended', color: 'bg-gray-500' };
    }
  };

  const { status, color } = getClassStatus();

  const copyCodeKey = () => {
    navigator.clipboard.writeText(liveClass.course_key);
    toast({
      title: 'Course Key Copied',
      description: 'The course key has been copied to your clipboard.',
    });
  };

  const joinMeeting = () => {
    window.open(liveClass.meeting_link, '_blank');
  };

  const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), 'MMM dd, yyyy • hh:mm a');
  };

  const getTimeUntilClass = () => {
    const now = new Date();
    const scheduledTime = new Date(liveClass.scheduled_at);
    const diffMs = scheduledTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return null;
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} from now`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m from now`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} from now`;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{liveClass.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={`${color} text-white border-0`}>
                {status === 'live' && '🔴 LIVE'}
                {status === 'upcoming' && '⏰ Upcoming'}
                {status === 'ended' && '✅ Ended'}
              </Badge>
              {userRole === 'teacher' && (
                <Badge variant="outline" className="text-xs">
                  Key: {liveClass.course_key}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {userRole === 'student' && (
          <p className="text-sm text-gray-600 mb-2">
            Teacher: {liveClass.teacher_name}
          </p>
        )}
        
        {liveClass.description && (
          <p className="text-sm text-gray-700 line-clamp-2">
            {liveClass.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formatDateTime(liveClass.scheduled_at)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="mr-2 h-4 w-4" />
            <span>{liveClass.duration_minutes} minutes</span>
            {status === 'upcoming' && getTimeUntilClass() && (
              <span className="ml-2 text-blue-600 font-medium">
                • {getTimeUntilClass()}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="mr-2 h-4 w-4" />
            <span>Max {liveClass.max_participants} participants</span>
          </div>

          <div className="flex gap-2 pt-2">
            {userRole === 'teacher' ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCodeKey}
                  className="flex-1"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Copy Key
                </Button>
                <Button
                  size="sm"
                  onClick={joinMeeting}
                  disabled={status === 'ended'}
                  className="flex-1 bg-torah-500 hover:bg-torah-600"
                >
                  <Video className="mr-1 h-3 w-3" />
                  {status === 'live' ? 'Join Now' : 'Preview'}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={joinMeeting}
                disabled={status === 'ended'}
                className="w-full bg-torah-500 hover:bg-torah-600"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                {status === 'live' ? 'Join Live Class' : 
                 status === 'upcoming' ? 'Join When Live' : 'Class Ended'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveClassCard;
