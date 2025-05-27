
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SOSPartner = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Study Partner
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow learners and teachers for collaborative Torah study
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">SOS Partner</CardTitle>
                <CardDescription>
                  Find immediate study partners available right now
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/sos-partner">
                  <Button className="w-full" variant="default">
                    Find Partner Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">SOS Havrouta</CardTitle>
                <CardDescription>
                  Connect with dedicated learning partners for regular study
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/sos-havrouta">
                  <Button className="w-full" variant="outline">
                    Find Havrouta
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Quick Connect</CardTitle>
                <CardDescription>
                  Get instant help from available teachers and mentors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/find-teachers">
                  <Button className="w-full" variant="secondary">
                    Connect Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-6">
            Join our community of learners and discover the joy of collaborative Torah study
          </p>
          <Link to="/find-partner">
            <Button size="lg" className="px-8">
              Browse All Partners
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SOSPartner;
