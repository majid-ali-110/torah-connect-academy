
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Clock, BookOpen, Heart } from 'lucide-react';

const SOSPartner = () => {
  return (
    <div className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Find Your Perfect Study Partner
            </h2>
            
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Join our vibrant community of learners and find a chavruta (study partner) 
              who shares your passion for Torah study and Jewish learning.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-200 mr-3" />
                <span className="text-blue-100">Match with compatible study partners</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-blue-200 mr-3" />
                <span className="text-blue-100">Flexible scheduling across time zones</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-blue-200 mr-3" />
                <span className="text-blue-100">Study various Jewish texts together</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-blue-200 mr-3" />
                <span className="text-blue-100">Build lasting learning relationships</span>
              </div>
            </div>
            
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Link to="/find-partner">Find Study Partners</Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Active Study Groups
                </h3>
                <p className="text-blue-100">
                  Join thousands of students learning together
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-blue-200 text-sm">Active Partnerships</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">15+</div>
                  <div className="text-blue-200 text-sm">Study Topics</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-blue-200 text-sm">Global Access</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-blue-200 text-sm">Satisfaction Rate</div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-white font-medium">Currently Active</span>
                </div>
                <p className="text-blue-100 text-sm">
                  147 study partners are currently online and available for learning
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SOSPartner;
