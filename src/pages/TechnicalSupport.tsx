
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, HelpCircle, Settings, Zap, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const TechnicalSupport = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      priority: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          email: formData.email,
          subject: formData.subject,
          description: formData.description,
          priority: formData.priority,
          user_id: user?.id || null,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: 'Support Ticket Created',
        description: 'Your support request has been submitted. We will get back to you soon!',
      });

      setFormData({ email: '', subject: '', description: '', priority: 'medium' });
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit support request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const commonIssues = [
    {
      icon: <HelpCircle className="h-6 w-6 text-blue-600" />,
      title: "Login Issues",
      description: "Can't sign in or forgot your password?",
      solution: "Use the 'Forgot Password' link on the login page or contact support."
    },
    {
      icon: <Settings className="h-6 w-6 text-green-600" />,
      title: "Technical Problems",
      description: "Video not loading or audio issues?",
      solution: "Check your internet connection and browser settings. Try refreshing the page."
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      title: "Performance Issues",
      description: "Slow loading or app freezing?",
      solution: "Clear your browser cache and ensure you have a stable internet connection."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Technical Support</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Having technical difficulties? We're here to help you get back to learning as quickly as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Common Issues */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-4">Common Issues</h2>
            {commonIssues.map((issue, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    {issue.icon}
                    <span className="ml-2">{issue.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{issue.description}</p>
                  <p className="text-sm text-torah-600 font-medium">{issue.solution}</p>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Need Immediate Help?</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      For urgent technical issues during live sessions, contact our emergency support line.
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Emergency Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <p className="text-gray-600">Describe your technical issue and we'll help you resolve it.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Issue Summary *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief description of the issue"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={formData.priority} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General question</SelectItem>
                        <SelectItem value="medium">Medium - Issue affecting usage</SelectItem>
                        <SelectItem value="high">High - Cannot access important features</SelectItem>
                        <SelectItem value="urgent">Urgent - System completely unusable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Please provide a detailed description of the issue, including:
- What you were trying to do
- What happened instead
- Any error messages you saw
- Your browser and operating system
- Steps to reproduce the issue"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-torah-600 hover:bg-torah-700"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Support Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupport;
