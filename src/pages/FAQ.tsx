
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
}

const FAQ = () => {
  const { t } = useLanguage();
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [faqItems, searchTerm, categoryFilter]);

  const fetchFAQItems = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      setFaqItems(data || []);
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = faqItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const getUniqueCategories = () => {
    return [...new Set(faqItems.map(item => item.category))];
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      'getting_started': t('faq.getting_started') || 'Getting Started',
      'courses': t('faq.courses') || 'Courses',
      'booking': t('faq.booking') || 'Booking',
      'payment': t('faq.payment') || 'Payment',
      'general': t('faq.general') || 'General'
    };
    return categoryNames[category] || category;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
              {t('faq.title') || 'Frequently Asked Questions'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('faq.description') || 'Find answers to common questions about our Torah learning platform'}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('faq.search_placeholder') || "Search FAQ..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('faq.all_categories') || "All Categories"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('faq.all_categories') || 'All Categories'}</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryDisplayName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t('faq.common_questions') || 'Common Questions'}</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredItems.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredItems.map((faq) => (
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
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {t('faq.no_results') || 'No FAQ items found matching your criteria.'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default FAQ;
