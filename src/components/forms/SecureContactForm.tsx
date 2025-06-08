
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeText } from '@/utils/inputSanitization';

const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

interface SecureContactFormProps {
  onSubmitSuccess?: () => void;
}

const SecureContactForm: React.FC<SecureContactFormProps> = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      
      // Sanitize all inputs
      const sanitizedData = {
        name: sanitizeText(data.name),
        email: data.email.toLowerCase().trim(),
        subject: sanitizeText(data.subject),
        message: sanitizeText(data.message)
      };

      const { error } = await supabase
        .from('contact_submissions')
        .insert([sanitizedData]);

      if (error) throw error;

      toast.success('Message sent successfully!');
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('name')}
              placeholder="Your Name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('email')}
              type="email"
              placeholder="Your Email"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

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
            <Textarea
              {...register('message')}
              placeholder="Your Message"
              rows={5}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecureContactForm;
