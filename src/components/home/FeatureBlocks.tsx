
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Video, Calendar, MessageCircle, Award } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive Torah Study',
    description: 'Learn Tanakh, Talmud, Halacha, and Jewish philosophy with expert guidance and traditional methodology.'
  },
  {
    icon: Users,
    title: 'Qualified Teachers',
    description: 'Connect with certified rabbis and experienced educators who are passionate about Jewish learning.'
  },
  {
    icon: Video,
    title: 'Live Interactive Classes',
    description: 'Join real-time sessions with video, audio, and screen sharing for an immersive learning experience.'
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Book lessons at times that work for you, with teachers available across different time zones.'
  },
  {
    icon: MessageCircle,
    title: 'Study Partners',
    description: 'Find and connect with study partners for chavruta learning and collaborative Torah study.'
  },
  {
    icon: Award,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with session records, notes, and personalized feedback.'
  }
];

const FeatureBlocks = () => {
  return (
    <div className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for Torah Learning
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the tools and resources you need for meaningful Jewish education, 
            whether you're a beginner or advanced student.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureBlocks;
