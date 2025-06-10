
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, Users, BookOpen, Gift } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  audience: string;
  age_range: string;
  price: number;
  session_duration_minutes: number;
  total_sessions: number;
  max_students: number;
  is_trial_available: boolean;
  teacher_id: string;
  teacher: {
    first_name: string;
    last_name: string;
  };
}

export const CourseEnrollment: React.FC = () => {
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses...');
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          subject,
          audience,
          age_range,
          price,
          session_duration_minutes,
          total_sessions,
          max_students,
          is_trial_available,
          teacher_id,
          profiles!courses_teacher_id_fkey(
            first_name,
            last_name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }

      console.log('Raw courses data:', data);

      if (!data) {
        console.log('No courses data returned');
        setCourses([]);
        return;
      }

      // Transform the data to match our interface
      const formattedCourses: Course[] = data.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        subject: course.subject,
        audience: course.audience,
        age_range: course.age_range || '',
        price: course.price || 0,
        session_duration_minutes: course.session_duration_minutes || 30,
        total_sessions: course.total_sessions || 1,
        max_students: course.max_students || 10,
        is_trial_available: course.is_trial_available ?? true,
        teacher_id: course.teacher_id,
        teacher: {
          first_name: course.profiles?.first_name || 'Unknown',
          last_name: course.profiles?.last_name || 'Teacher'
        }
      }));

      console.log('Formatted courses:', formattedCourses);
      setCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async (courseId: string, isTrialRequest: boolean = false) => {
    if (!user || !profile) {
      toast.error('Please log in to enroll');
      return;
    }

    // Check trial eligibility
    if (isTrialRequest && (profile.trial_lessons_used || 0) >= (profile.max_trial_lessons || 2)) {
      toast.error('You have used all your trial lessons');
      return;
    }

    setEnrolling(courseId);
    try {
      console.log('Attempting enrollment:', { courseId, isTrialRequest, userId: user.id });

      // First check if sponsored course is available
      const { data: sponsoredAvailable, error: sponsoredError } = await supabase
        .rpc('assign_sponsored_course', { 
          user_id: user.id, 
          course_id: courseId 
        });

      if (sponsoredError) {
        console.error('Error checking sponsored course:', sponsoredError);
        // Continue with normal flow if sponsored check fails
      }

      if (sponsoredAvailable) {
        // Sponsored course assigned successfully
        toast.success('Congratulations! Your course has been sponsored by our community!');
      } else if (isTrialRequest) {
        // Create trial session
        const course = courses.find(c => c.id === courseId);
        if (!course) throw new Error('Course not found');

        console.log('Creating trial session for course:', course);

        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + 1); // Tomorrow

        const { error: sessionError } = await supabase
          .from('course_sessions')
          .insert({
            course_id: courseId,
            teacher_id: course.teacher_id,
            student_id: user.id,
            session_date: sessionDate.toISOString(),
            duration_minutes: course.session_duration_minutes,
            session_type: 'trial',
            status: 'scheduled'
          });

        if (sessionError) {
          console.error('Error creating session:', sessionError);
          throw sessionError;
        }

        // Update trial lessons used
        const newTrialCount = (profile.trial_lessons_used || 0) + 1;
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            trial_lessons_used: newTrialCount
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          throw profileError;
        }

        toast.success('Trial lesson scheduled! You will receive further instructions by email.');
      } else {
        // Regular enrollment - redirect to donation page
        toast.info('Please consider making a donation to support others in their learning journey!');
        // Here you would typically redirect to a donation/payment page
      }

      fetchCourses(); // Refresh courses
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  const remainingTrials = (profile?.max_trial_lessons || 2) - (profile?.trial_lessons_used || 0);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Available Courses</h1>
        {profile && remainingTrials > 0 && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Gift className="w-5 h-5 text-green-600" />
            <span className="text-green-800">
              You have {remainingTrials} free trial lesson{remainingTrials !== 1 ? 's' : ''} remaining!
            </span>
          </div>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
          <p className="text-gray-600">Check back later for new courses!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-gray-600">
                      by {course.teacher.first_name} {course.teacher.last_name}
                    </p>
                  </div>
                  <Badge variant="outline">{course.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-gray-600">{course.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{course.session_duration_minutes} min × {course.total_sessions} sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>Max {course.max_students} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.audience} • {course.age_range}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  {course.is_trial_available && remainingTrials > 0 && (
                    <Button
                      onClick={() => handleEnrollment(course.id, true)}
                      disabled={enrolling === course.id}
                      variant="outline"
                      className="w-full"
                    >
                      {enrolling === course.id ? 'Scheduling...' : 'Book Free Trial'}
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => handleEnrollment(course.id, false)}
                    disabled={enrolling === course.id}
                    className="w-full"
                  >
                    {enrolling === course.id ? 'Enrolling...' : 'Enroll in Course'}
                  </Button>
                </div>
                
                <p className="text-xs text-center text-gray-500">
                  Our platform is supported by community donations
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
