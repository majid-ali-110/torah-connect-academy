
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageSquare, Ticket, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Support = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (user) {
      fetchUserTickets();
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const fetchUserTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id || null,
          email: formData.email,
          subject: formData.subject,
          description: formData.description,
          priority: formData.priority
        });

      if (error) throw error;

      toast({
        title: t('support.success_title') || "Ticket Created",
        description: t('support.success_description') || "Your support ticket has been created successfully.",
      });

      setFormData({
        email: user?.email || '',
        subject: '',
        description: '',
        priority: 'medium'
      });

      if (user) {
        fetchUserTickets();
      }
    } catch (error) {
      console.error('Error creating support ticket:', error);
      toast({
        title: t('support.error_title') || "Error",
        description: t('support.error_description') || "Failed to create support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              {t('support.title') || 'Technical Support'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('support.description') || 'Get help with technical issues and account problems'}
            </p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('create')}>
              <CardContent className="text-center p-6">
                <Ticket className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('support.create_ticket') || 'Create Ticket'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('support.create_description') || 'Submit a new support request'}
                </p>
              </CardContent>
            </Card>

            {user && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('tickets')}>
                <CardContent className="text-center p-6">
                  <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t('support.my_tickets') || 'My Tickets'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t('support.tickets_description') || 'View your support tickets'}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('faq')}>
              <CardContent className="text-center p-6">
                <HelpCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('support.faq') || 'FAQ'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('support.faq_description') || 'Find quick answers'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Create Ticket Form */}
          {activeTab === 'create' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('support.new_ticket') || 'Create New Support Ticket'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder={t('support.email_placeholder') || "Your Email"}
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      disabled={!!user?.email}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder={t('support.subject_placeholder') || "Subject"}
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('support.priority') || "Priority"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t('support.low') || 'Low'}</SelectItem>
                        <SelectItem value="medium">{t('support.medium') || 'Medium'}</SelectItem>
                        <SelectItem value="high">{t('support.high') || 'High'}</SelectItem>
                        <SelectItem value="urgent">{t('support.urgent') || 'Urgent'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Textarea
                      placeholder={t('support.description_placeholder') || "Describe your issue in detail..."}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 
                      (t('support.submitting') || 'Submitting...') : 
                      (t('support.submit_ticket') || 'Submit Ticket')
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* My Tickets */}
          {activeTab === 'tickets' && user && (
            <Card>
              <CardHeader>
                <CardTitle>{t('support.my_tickets') || 'My Support Tickets'}</CardTitle>
              </CardHeader>
              <CardContent>
                {tickets.length > 0 ? (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{ticket.subject}</h3>
                          <div className="flex space-x-2">
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{ticket.description}</p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {t('support.no_tickets') || 'No support tickets found.'}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* FAQ Section */}
          {activeTab === 'faq' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('support.common_issues') || 'Common Technical Issues'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="login">
                    <AccordionTrigger>
                      {t('support.faq_login') || "I can't log into my account"}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t('support.faq_login_answer') || "Try resetting your password using the 'Forgot Password' link on the login page. If that doesn't work, contact our support team."}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="video">
                    <AccordionTrigger>
                      {t('support.faq_video') || "Video calls are not working"}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t('support.faq_video_answer') || "Check your internet connection and browser permissions for camera and microphone access. Try refreshing the page or using a different browser."}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="payment">
                    <AccordionTrigger>
                      {t('support.faq_payment') || "Payment issues"}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t('support.faq_payment_answer') || "If your payment failed, check your card details and try again. For other payment issues, contact our billing support team."}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Support;
