
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Video, Globe } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Learn Torah with
              <span className="text-blue-600 block">Expert Teachers</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with qualified Jewish teachers for personalized Torah study, 
              Talmud lessons, Hebrew language learning, and spiritual growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/find-teachers">Find a Teacher</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth">Start Learning Today</Link>
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full p-3 shadow-lg mb-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Torah Study</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full p-3 shadow-lg mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Expert Teachers</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full p-3 shadow-lg mb-2">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Live Classes</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full p-3 shadow-lg mb-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Global Community</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Interactive Learning
                  </h3>
                  <p className="text-gray-600">
                    Join thousands of students learning from home
                  </p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">1,000+</div>
                  <div className="text-sm text-gray-600">Teachers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">25,000+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">30+</div>
                  <div className="text-sm text-gray-600">Subjects</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
