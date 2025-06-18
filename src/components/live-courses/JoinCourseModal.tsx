
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Clock, Users, Video, AlertCircle, CheckCircle } from 'lucide-react';

interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  max_participants: number;
  course_key: string;
  meeting_link: string;
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface JoinCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId?: string;
}

const JoinCourseModal: React.FC<JoinCourseModalProps> = ({
  isOpen,
  onClose,
  classId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [canJoin, setCanJoin] = useState(true);

  useEffect(() => {
    if (isOpen && classId) {
      fetchClassDetails();
    }
  }, [isOpen, classId]);

  const fetchClassDetails = async () => {
    if (!classId || !user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('live_classes')
        .select(`
          id,
          title,
          description,
          scheduled_at,
          duration_minutes,
          max_participants,
          course_key,
          meeting_link,
          teacher:profiles!live_classes_teacher_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq('id', classId)
        .single();

      if (error) throw error;
      setLiveClass(data);
      
      // For now, assume everyone can join (we can add enrollment checks later)
      setCanJoin(true);
    } catch (error) {
      console.error('Error fetching class:', error);
      toast({
        title: 'Error',
        description: 'Failed to load class details.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!user || !liveClass) return;
    
    setJoining(true);
    try {
      // Record enrollment in live_class_enrollments table
      const { error: enrollmentError } = await supabase
        .from('live_class_enrollments')
        .insert({
          live_class_id: liveClass.id,
          student_id: user.id
        });

      if (enrollmentError && !enrollmentError.message.includes('duplicate')) {
        throw enrollmentError;
      }

      toast({
        title: 'Success',
        description: 'You have joined the live class!',
      });

      // Redirect to live session
      window.open(liveClass.meeting_link, '_blank');
      onClose();
    } catch (error) {
      console.error('Error joining class:', error);
      toast({
        title: 'Error',
        description: 'Failed to join class. Please try again.',
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

  if (!liveClass) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Class not found.</p>
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
            Join Live Class
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{liveClass.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Live Class</Badge>
                <Badge variant="secondary">Course Key: {liveClass.course_key}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {liveClass.description && (
                <p className="text-gray-600">{liveClass.description}</p>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                  <span>
                    {new Date(liveClass.scheduled_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{liveClass.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Max {liveClass.max_participants} students</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500">Teacher:</span>
                  <span className="ml-1">
                    {liveClass.teacher.first_name} {liveClass.teacher.last_name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className={`p-4 rounded-lg border ${
            canJoin 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              {canJoin ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${
                  canJoin ? 'text-green-800' : 'text-red-800'
                }`}>
                  {canJoin ? 'You can join this class!' : 'Cannot join this class'}
                </p>
                <p className={`text-sm ${
                  canJoin ? 'text-green-700' : 'text-red-700'
                }`}>
                  {canJoin ? 'Click below to join the live session.' : 'Please contact support for assistance.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleJoinClass}
              disabled={!canJoin || joining}
              className="bg-torah-500 hover:bg-torah-600"
            >
              {joining ? 'Joining...' : 'Join Class'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCourseModal;
