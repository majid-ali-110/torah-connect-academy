
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { KeyRound, Users } from 'lucide-react';

interface JoinCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassJoined: () => void;
}

const JoinCourseModal: React.FC<JoinCourseModalProps> = ({
  isOpen,
  onClose,
  onClassJoined
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courseKey, setCourseKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !courseKey.trim()) return;

    setLoading(true);
    try {
      // First, check if the course exists
      const { data: liveClass, error: fetchError } = await supabase
        .from('live_classes')
        .select(`
          *,
          profiles!teacher_id (
            first_name,
            last_name
          )
        `)
        .eq('course_key', courseKey.trim().toUpperCase())
        .single();

      if (fetchError || !liveClass) {
        toast({
          title: 'Invalid Course Key',
          description: 'The course key you entered does not exist. Please check and try again.',
          variant: 'destructive'
        });
        return;
      }

      // Check if student is already enrolled
      const { data: existingEnrollment } = await supabase
        .from('class_enrollments')
        .select('id')
        .eq('class_id', liveClass.id)
        .eq('student_id', user.id)
        .single();

      if (existingEnrollment) {
        toast({
          title: 'Already Enrolled',
          description: 'You are already enrolled in this live class.',
          variant: 'destructive'
        });
        return;
      }

      // Check current enrollment count
      const { count: currentEnrollments } = await supabase
        .from('class_enrollments')
        .select('*', { count: 'exact' })
        .eq('class_id', liveClass.id);

      if (currentEnrollments && currentEnrollments >= liveClass.max_participants) {
        toast({
          title: 'Class Full',
          description: 'This live class has reached its maximum capacity.',
          variant: 'destructive'
        });
        return;
      }

      // Enroll the student
      const { error: enrollError } = await supabase
        .from('class_enrollments')
        .insert({
          class_id: liveClass.id,
          student_id: user.id
        });

      if (enrollError) {
        toast({
          title: 'Error',
          description: 'Failed to join the live class. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      const teacherName = `${liveClass.profiles?.first_name || ''} ${liveClass.profiles?.last_name || ''}`.trim();
      
      toast({
        title: 'Successfully Joined!',
        description: `You've joined "${liveClass.title}" by ${teacherName}`,
      });

      setCourseKey('');
      onClassJoined();
    } catch (error) {
      console.error('Error joining live class:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <KeyRound className="mr-2 h-5 w-5" />
            Join Live Class
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="courseKey">Course Key *</Label>
            <Input
              id="courseKey"
              value={courseKey}
              onChange={(e) => setCourseKey(e.target.value)}
              placeholder="Enter the course key provided by your teacher"
              className="mt-1"
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              Course keys are usually 8 characters long (e.g., ABC123XY)
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Users className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">How to get a course key:</p>
                <ul className="text-sm text-green-700 mt-1 list-disc list-inside">
                  <li>Ask your teacher for the course key</li>
                  <li>Check class announcements or emails</li>
                  <li>Look for it in your course materials</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !courseKey.trim()}
              className="bg-torah-500 hover:bg-torah-600"
            >
              {loading ? 'Joining...' : 'Join Class'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCourseModal;
