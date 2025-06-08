
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeText } from '@/utils/inputSanitization';

const supportSchema = z.object({
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority level'
  })
});

type SupportFormData = z.infer<typeof supportSchema>;

interface SecureSupportFormProps {
  onSubmitSuccess?: () => void;
}

const SecureSupportForm: React.FC<SecureSupportFormProps> = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile } = useAuth();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema)
  });

  const onSubmit = async (data: SupportFormData) => {
    if (!user || !profile) {
      toast.error('Please log in to submit a support ticket');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Sanitize all inputs
      const sanitizedData = {
        subject: sanitizeText(data.subject),
        description: sanitizeText(data.description),
        priority: data.priority,
        email: profile.email,
        user_id: user.id
      };

      const { error } = await supabase
        .from('support_tickets')
        .insert([sanitizedData]);

      if (error) throw error;

      toast.success('Support ticket submitted successfully!');
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast.error('Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            Please log in to submit a support ticket.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Technical Support</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('subject')}
              placeholder="Subject"
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <Select onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}>
              <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...register('description')}
              placeholder="Describe your issue in detail"
              rows={6}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecureSupportForm;
