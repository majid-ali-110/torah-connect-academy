
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Video, BookOpen } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Find Your Teacher',
    description: 'Browse our extensive directory of qualified Jewish educators and find the perfect match for your learning goals.',
    step: '01'
  },
  {
    icon: Calendar,
    title: 'Schedule Your Lesson',
    description: 'Book convenient time slots that work with your schedule. Our teachers are available across different time zones.',
    step: '02'
  },
  {
    icon: Video,
    title: 'Join Live Sessions',
    description: 'Connect with your teacher through our integrated video platform for interactive and engaging learning experiences.',
    step: '03'
  },
  {
    icon: BookOpen,
    title: 'Progress & Learn',
    description: 'Track your progress, receive personalized feedback, and advance in your Jewish studies journey.',
    step: '04'
  }
];

const HowItWorksNew = () => {
  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Getting started with Torah learning has never been easier. Follow these simple steps 
            to begin your Jewish education journey today.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
                        <step.icon className="h-10 w-10 text-blue-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksNew;
