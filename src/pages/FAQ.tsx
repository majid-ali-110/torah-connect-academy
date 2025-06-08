
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqData = [
  {
    id: '1',
    question: 'How do I get started with Torah learning?',
    answer: 'Begin by creating an account and browsing our available courses. We recommend starting with beginner-level classes that match your interests and schedule.'
  },
  {
    id: '2',
    question: 'Are the classes suitable for all levels?',
    answer: 'Yes! We offer courses for beginners, intermediate, and advanced students. Each course clearly indicates its difficulty level.'
  },
  {
    id: '3',
    question: 'How do I schedule a session with a teacher?',
    answer: 'Browse our teachers directory, select a teacher that matches your needs, and use the booking system to schedule a session at a convenient time.'
  },
  {
    id: '4',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards and PayPal. Payments are processed securely through our platform.'
  },
  {
    id: '5',
    question: 'Can I cancel or reschedule a lesson?',
    answer: 'Yes, you can cancel or reschedule lessons up to 24 hours before the scheduled time without penalty.'
  },
  {
    id: '6',
    question: 'Do you offer group study sessions?',
    answer: 'Yes! We have group courses and you can also use our study partner feature to find others learning similar topics.'
  }
];

const FAQ = () => {
  const { t } = useLanguage();

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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our Torah learning platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Common Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq) => (
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

export default FAQ;
