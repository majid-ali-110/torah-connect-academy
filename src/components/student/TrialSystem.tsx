
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  price: number;
  teacher: {
    first_name: string;
    last_name: string;
  };
  is_trial_available: boolean;
}

interface TrialSession {
  id: string;
  subject: string;
  status: string;
  session_date: string;
  course: {
    title: string;
  };
}

export const TrialSystem: React.FC = () => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [myTrials, setMyTrials] = useState<TrialSession[]>([]);
  const [usedTrials, setUsedTrials] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailableCourses();
    fetchMyTrials();
    fetchUsedTrials();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(first_name, last_name)
        `)
        .eq('is_active', true)
        .eq('is_trial_available', true);

      if (error) throw error;
      setAvailableCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const fetchMyTrials = async () => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('trial_sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .eq('student_id', currentUser.user?.id);

      if (error) throw error;
      setMyTrials(data || []);
    } catch (error) {
      console.error('Error fetching trials:', error);
      toast.error('Failed to load trials');
    }
  };

  const fetchUsedTrials = async () => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('trial_sessions')
        .select('subject')
        .eq('student_id', currentUser.user?.id);

      if (error) throw error;
      setUsedTrials(data?.map(trial => trial.subject) || []);
    } catch (error) {
      console.error('Error fetching used trials:', error);
    }
  };

  const bookTrialSession = async (course: Course) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      // Check if already used trial for this subject
      if (usedTrials.includes(course.subject)) {
        toast.error('You have already used your free trial for this subject');
        return;
      }

      const { error } = await supabase
        .from('trial_sessions')
        .insert({
          student_id: currentUser.user?.id,
          subject: course.subject,
          course_id: course.id,
          teacher_id: course.teacher_id,
          session_date: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Trial session booked successfully! Teacher will contact you soon.');
      fetchMyTrials();
      fetchUsedTrials();
    } catch (error) {
      console.error('Error booking trial:', error);
      toast.error('Failed to book trial session');
    }
  };

  const requestPaymentForCourse = async (course: Course) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          student_id: currentUser.user?.id,
          course_id: course.id,
          amount: course.price
        });

      if (error) throw error;

      // Here you would typically trigger an email sending function
      toast.success('Payment request sent! Check your email for payment instructions.');
    } catch (error) {
      console.error('Error requesting payment:', error);
      toast.error('Failed to request payment');
    }
  };

  const getSubjectTrialStatus = (subject: string) => {
    return usedTrials.includes(subject);
  };

  // Group courses by subject
  const coursesBySubject = availableCourses.reduce((acc, course) => {
    if (!acc[course.subject]) {
      acc[course.subject] = [];
    }
    acc[course.subject].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Course Enrollment</h2>
      
      {myTrials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              My Trial Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myTrials.map((trial) => (
                <div key={trial.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{trial.course?.title}</h4>
                    <p className="text-sm text-gray-600">Subject: {trial.subject}</p>
                  </div>
                  <Badge variant={trial.status === 'completed' ? 'default' : 'secondary'}>
                    {trial.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(coursesBySubject).map(([subject, courses]) => {
          const hasUsedTrial = getSubjectTrialStatus(subject);
          
          return (
            <Card key={subject}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {subject}
                  </span>
                  {hasUsedTrial && (
                    <Badge variant="outline">Trial Used</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{course.title}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {course.teacher.first_name} {course.teacher.last_name}
                          </p>
                          <p className="text-sm mt-1">{course.description}</p>
                          <p className="text-sm font-medium mt-2">
                            Price: €{(course.price / 100).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!hasUsedTrial ? (
                            <Button
                              onClick={() => bookTrialSession(course)}
                              variant="outline"
                              size="sm"
                            >
                              Book Free Trial
                            </Button>
                          ) : (
                            <Button
                              onClick={() => requestPaymentForCourse(course)}
                              size="sm"
                            >
                              Enroll Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
