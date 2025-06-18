import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { CourseEnrollment } from '@/components/student/CourseEnrollment';
import { DonationInterface } from '@/components/donations/DonationInterface';
import JoinCourseModal from '@/components/live-courses/JoinCourseModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Gift, Heart, Calendar, Video, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LiveSession {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  max_participants: number;
  course: {
    id: string;
    title: string;
    subject: string;
  };
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

const StudentDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    if (activeTab === 'live-sessions') {
      fetchLiveSessions();
    }
  }, [activeTab]);

  const fetchLiveSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          id,
          title,
          description,
          scheduled_at,
          duration_minutes,
          max_participants,
          course:courses(
            id,
            title,
            subject
          ),
          teacher:profiles!live_sessions_teacher_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setLiveSessions(data || []);
    } catch (error) {
      console.error('Error fetching live sessions:', error);
    }
  };

  const handleJoinSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowJoinModal(true);
  };

  const handleCloseJoinModal = () => {
    setShowJoinModal(false);
    setSelectedSessionId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'student') {
    return <Navigate to="/auth" replace />;
  }

  const remainingTrials = (profile.max_trial_lessons || 2) - (profile.trial_lessons_used || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile.first_name}!</p>
            </div>
            {remainingTrials > 0 && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Gift className="w-4 h-4 mr-1" />
                {remainingTrials} Free Trial{remainingTrials !== 1 ? 's' : ''} Available
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses">Browse Courses</TabsTrigger>
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="live-sessions">Live Sessions</TabsTrigger>
            <TabsTrigger value="donate">Support Others</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CourseEnrollment />
          </TabsContent>

          <TabsContent value="my-courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Active enrollments</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Hours</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Learning time</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>My Learning Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your enrolled courses and progress will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live-sessions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Live Sessions</h2>
              <Button
                onClick={fetchLiveSessions}
                variant="outline"
                size="sm"
              >
                Refresh
              </Button>
            </div>

            {liveSessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No live sessions available</h3>
                  <p className="text-gray-600">Check back later for upcoming live sessions!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveSessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{session.title}</CardTitle>
                          <p className="text-sm text-gray-600">
                            by {session.teacher.first_name} {session.teacher.last_name}
                          </p>
                        </div>
                        <Badge variant="outline">{session.course.subject}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {session.description && (
                        <p className="text-sm text-gray-600">{session.description}</p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span>
                            {new Date(session.scheduled_at).toLocaleDateString()} at{' '}
                            {new Date(session.scheduled_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{session.duration_minutes} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Max {session.max_participants} students</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleJoinSession(session.id)}
                        className="w-full bg-torah-500 hover:bg-torah-600"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="donate">
            <DonationInterface />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <p className="text-gray-900">{profile.first_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <p className="text-gray-900">{profile.last_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Learning Level</label>
                    <p className="text-gray-900">{profile.learning_level || 'Not set'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Trial Lessons</label>
                  <p className="text-gray-900">
                    Used: {profile.trial_lessons_used || 0} / {profile.max_trial_lessons || 2}
                  </p>
                </div>

                {profile.bio && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <p className="text-gray-900">{profile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <JoinCourseModal
        isOpen={showJoinModal}
        onClose={handleCloseJoinModal}
        sessionId={selectedSessionId}
      />
    </div>
  );
};

export default StudentDashboard;
