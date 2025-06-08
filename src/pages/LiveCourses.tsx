
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Video, Users, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import LiveCoursesWrapper from '@/components/live-courses/LiveCoursesWrapper';
// import CreateLiveClassModal from '@/components/live-courses/CreateLiveClassModal';
// import JoinCourseModal from '@/components/live-courses/JoinCourseModal';
// import LiveClassCard from '@/components/live-courses/LiveClassCard';

const LiveCourses = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <LiveCoursesWrapper>
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Courses</h1>
                <p className="text-gray-600">
                  {profile?.role === 'teacher' 
                    ? 'Create and manage your live classes' 
                    : 'Join live classes and interactive sessions'
                  }
                </p>
              </div>
            </div>

            {/* Temporary message while database types are being updated */}
            <Card>
              <CardContent className="text-center py-12">
                <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Live Courses Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  The live courses functionality is being updated to work with the new approval system.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </LiveCoursesWrapper>
    </Layout>
  );
};

export default LiveCourses;
