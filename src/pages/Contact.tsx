
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });

      if (error) throw error;

      toast({
        title: t('contact.success_title') || "Message Sent",
        description: t('contact.success_description') || "Thank you for contacting us. We'll get back to you soon!",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: t('contact.error_title') || "Error",
        description: t('contact.error_description') || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('contact.title') || 'Contact Us'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('contact.description') || "We're here to help with any questions about Torah learning"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.form_title') || 'Send us a Message'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder={t('contact.name_placeholder') || "Your Name"}
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder={t('contact.email_placeholder') || "Your Email"}
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('contact.subject_placeholder') || "Select Subject"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">{t('contact.general_inquiry') || 'General Inquiry'}</SelectItem>
                        <SelectItem value="courses">{t('contact.course_info') || 'Course Information'}</SelectItem>
                        <SelectItem value="teachers">{t('contact.teacher_application') || 'Teacher Application'}</SelectItem>
                        <SelectItem value="technical">{t('contact.technical_support') || 'Technical Support'}</SelectItem>
                        <SelectItem value="billing">{t('contact.billing') || 'Billing Question'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Textarea
                      placeholder={t('contact.message_placeholder') || "Your Message"}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 
                      (t('contact.sending') || 'Sending...') : 
                      (t('contact.send_message') || 'Send Message')
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('contact.contact_info') || 'Contact Information'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>support@torahlearn.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>123 Torah Street, Learning City, LC 12345</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('contact.office_hours') || 'Office Hours'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div>{t('contact.weekdays') || 'Sunday - Thursday: 9:00 AM - 6:00 PM'}</div>
                      <div>{t('contact.friday') || 'Friday: 9:00 AM - 2:00 PM'}</div>
                      <div>{t('contact.saturday') || 'Saturday: Closed'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contact;
