
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Video, Users, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import CreateLiveClassModal from '@/components/live-courses/CreateLiveClassModal';
import JoinCourseModal from '@/components/live-courses/JoinCourseModal';
import LiveClassCard from '@/components/live-courses/LiveClassCard';
import { supabase } from '@/integrations/supabase/client';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  teacher_id: string;
  course_key: string;
  meeting_link: string;
  scheduled_at: string;
  duration_minutes: number;
  max_participants: number;
  created_at: string;
  teacher_name: string;
}

const LiveCourses = () => {
  const { user, profile, loading } = useAuth();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLiveClasses();
    }
  }, [user]);

  const fetchLiveClasses = async () => {
    try {
      let query = supabase
        .from('live_classes')
        .select(`
          *,
          profiles!teacher_id (
            first_name,
            last_name
          )
        `)
        .order('scheduled_at', { ascending: true });

      // If user is a teacher, show only their classes
      if (profile?.role === 'teacher') {
        query = query.eq('teacher_id', user?.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching live classes:', error);
        return;
      }

      const formattedClasses = data?.map(cls => ({
        ...cls,
        teacher_name: `${cls.profiles?.first_name || ''} ${cls.profiles?.last_name || ''}`.trim()
      })) || [];

      setLiveClasses(formattedClasses);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleClassCreated = () => {
    setShowCreateModal(false);
    fetchLiveClasses();
  };

  const handleClassJoined = () => {
    setShowJoinModal(false);
    fetchLiveClasses();
  };

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
            <div className="flex space-x-4">
              {profile?.role === 'teacher' && (
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-torah-500 hover:bg-torah-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Live Class
                </Button>
              )}
              {profile?.role === 'student' && (
                <Button 
                  onClick={() => setShowJoinModal(true)}
                  variant="outline"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Join with Course Key
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {profile?.role === 'teacher' ? 'Total Classes' : 'Available Classes'}
                </CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveClasses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {liveClasses.filter(cls => 
                    new Date(cls.scheduled_at).toDateString() === new Date().toDateString()
                  ).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {profile?.role === 'teacher' ? 'Total Students' : 'Joined Classes'}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Classes Grid */}
          {loadingClasses ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading live classes...</p>
            </div>
          ) : liveClasses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {profile?.role === 'teacher' 
                    ? 'No live classes created yet' 
                    : 'No live classes available'
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {profile?.role === 'teacher' 
                    ? 'Create your first live class to start teaching interactively' 
                    : 'Check back later or ask your teacher for a course key'
                  }
                </p>
                {profile?.role === 'teacher' && (
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-torah-500 hover:bg-torah-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Live Class
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClasses.map((liveClass) => (
                <LiveClassCard 
                  key={liveClass.id} 
                  liveClass={liveClass}
                  userRole={profile?.role || 'student'}
                  onUpdate={fetchLiveClasses}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Modals */}
        <CreateLiveClassModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onClassCreated={handleClassCreated}
        />

        <JoinCourseModal 
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onClassJoined={handleClassJoined}
        />
      </div>
    </Layout>
  );
};

export default LiveCourses;
