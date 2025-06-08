
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Clock, Users, Video } from 'lucide-react';

interface CreateLiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassCreated: () => void;
}

const CreateLiveClassModal: React.FC<CreateLiveClassModalProps> = ({
  isOpen,
  onClose,
  onClassCreated
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    duration_minutes: '60',
    max_participants: '20',
    meeting_type: 'google_meet'
  });

  const generateCourseKey = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const generateGoogleMeetLink = () => {
    // In a real implementation, you would integrate with Google Calendar API
    // For now, we'll generate a placeholder meet link
    const meetId = Math.random().toString(36).substring(2, 12);
    return `https://meet.google.com/${meetId}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const courseKey = generateCourseKey();
      const meetingLink = generateGoogleMeetLink();

      const { error } = await supabase
        .from('live_classes')
        .insert({
          title: formData.title,
          description: formData.description,
          teacher_id: user.id,
          course_key: courseKey,
          meeting_link: meetingLink,
          scheduled_at: formData.scheduled_at,
          duration_minutes: parseInt(formData.duration_minutes),
          max_participants: parseInt(formData.max_participants)
        });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to create live class. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: `Live class created! Course key: ${courseKey}`,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        scheduled_at: '',
        duration_minutes: '60',
        max_participants: '20',
        meeting_type: 'google_meet'
      });

      onClassCreated();
    } catch (error) {
      console.error('Error creating live class:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get minimum date (today)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Video className="mr-2 h-5 w-5" />
            Create Live Class
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Class Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Introduction to Talmud"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what students will learn in this live class..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="scheduled_at" className="flex items-center">
                <CalendarDays className="mr-1 h-4 w-4" />
                Schedule Date & Time *
              </Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                min={getMinDateTime()}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration_minutes" className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                Duration (minutes)
              </Label>
              <Select 
                value={formData.duration_minutes} 
                onValueChange={(value) => handleInputChange('duration_minutes', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max_participants" className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                Max Participants
              </Label>
              <Select 
                value={formData.max_participants} 
                onValueChange={(value) => handleInputChange('max_participants', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 students</SelectItem>
                  <SelectItem value="10">10 students</SelectItem>
                  <SelectItem value="15">15 students</SelectItem>
                  <SelectItem value="20">20 students</SelectItem>
                  <SelectItem value="30">30 students</SelectItem>
                  <SelectItem value="50">50 students</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="meeting_type">Meeting Platform</Label>
              <Select 
                value={formData.meeting_type} 
                onValueChange={(value) => handleInputChange('meeting_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_meet">Google Meet</SelectItem>
                  <SelectItem value="zoom" disabled>Zoom (Coming Soon)</SelectItem>
                  <SelectItem value="teams" disabled>Teams (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After creating the class, you'll receive a unique course key that students can use to join. 
              A Google Meet link will be automatically generated for this session.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-torah-500 hover:bg-torah-600"
            >
              {loading ? 'Creating...' : 'Create Live Class'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLiveClassModal;
