import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  currentUserId: string;
  otherUser: any;
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  isOpen,
  onClose,
  conversationId,
  currentUserId,
  otherUser
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '60',
    subject: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Create lesson booking
      const { data: booking, error: bookingError } = await supabase
        .from('lesson_bookings')
        .insert([{
          student_id: otherUser.role === 'student' ? otherUser.id : currentUserId,
          teacher_id: otherUser.role === 'teacher' ? otherUser.id : currentUserId,
          lesson_date: formData.date,
          lesson_time: formData.time,
          duration_minutes: parseInt(formData.duration),
          subject: formData.subject,
          notes: formData.notes,
          status: 'scheduled'
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Send meeting request message
      const meetingMessage = `Meeting Request:\n\nDate: ${formData.date}\nTime: ${formData.time}\nDuration: ${formData.duration} minutes\nSubject: ${formData.subject}\n\n${formData.notes ? `Notes: ${formData.notes}` : ''}`;

      const { error: messageError } = (await supabase as any)
        .from('chat_messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: meetingMessage,
          message_type: 'meeting_request',
          meeting_data: {
            booking_id: booking.id,
            date: formData.date,
            time: formData.time,
            duration: formData.duration,
            subject: formData.subject,
            notes: formData.notes
          }
        }]);

      if (messageError) throw messageError;

      // Update conversation timestamp
      await (supabase as any)
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      toast({
        title: "Meeting Scheduled",
        description: "Your meeting request has been sent successfully.",
      });

      onClose();
      setFormData({
        date: '',
        time: '',
        duration: '60',
        subject: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Schedule Meeting</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              Meeting with <strong>{otherUser?.first_name} {otherUser?.last_name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Torah Study, Hebrew Lesson"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes or preparation instructions..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-torah-500 hover:bg-torah-600"
            >
              {submitting ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingScheduler;
