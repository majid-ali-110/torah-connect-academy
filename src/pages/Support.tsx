
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle, Book, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const supportFAQs = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
  },
  {
    id: '2',
    question: 'Why can\'t I join my scheduled video session?',
    answer: 'Make sure you have a stable internet connection and your browser allows camera/microphone access. Try refreshing the page or using a different browser.'
  },
  {
    id: '3',
    question: 'How do I cancel my subscription?',
    answer: 'Go to your profile settings, select "Billing" and click "Cancel Subscription". Your access will continue until the end of your billing period.'
  },
  {
    id: '4',
    question: 'The video quality is poor during lessons. What can I do?',
    answer: 'Check your internet speed, close other applications using bandwidth, and ensure you\'re in a well-lit area for better video quality.'
  }
];

const Support = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [ticketData, setTicketData] = useState({
    subject: '',
    priority: '',
    description: ''
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your support system
    toast({
      title: "Support Ticket Created",
      description: "We've received your request. Our team will respond within 24 hours.",
    });
    setTicketData({ subject: '', priority: '', description: '' });
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
              Technical Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get help with technical issues and platform questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Submit a Support Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Subject"
                        value={ticketData.subject}
                        onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Select 
                        value={ticketData.priority} 
                        onValueChange={(value) => setTicketData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Priority Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Textarea
                        placeholder="Describe your issue in detail..."
                        value={ticketData.description}
                        onChange={(e) => setTicketData(prev => ({ ...prev, description: e.target.value }))}
                        rows={6}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Submit Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Book className="h-4 w-4 mr-2" />
                    User Guide & Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Video Tutorials
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Live Chat Support
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Common Technical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {supportFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Support;
