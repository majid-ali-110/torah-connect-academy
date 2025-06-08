
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Cookie } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface LegalDocument {
  id: string;
  title: string;
  content: string;
  version: string;
  effective_date: string;
  updated_at: string;
}

const Cookies = () => {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCookies();
  }, []);

  const fetchCookies = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('document_type', 'cookies')
        .eq('is_current', true)
        .single();

      if (error) throw error;
      setDocument(data);
    } catch (error) {
      console.error('Error fetching cookie policy:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cookie policy',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cookie policy...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-gray-600">
            Understanding how we use cookies and similar technologies on our platform.
          </p>
        </motion.div>

        {document && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cookie className="h-6 w-6 mr-2 text-torah-600" />
                  {document.title}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Effective: {format(new Date(document.effective_date), 'MMMM dd, yyyy')}
                  </div>
                  <div>Version: {document.version}</div>
                  <div>Last Updated: {format(new Date(document.updated_at), 'MMMM dd, yyyy')}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: document.content.replace(/\n/g, '<br />') }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cookies;
