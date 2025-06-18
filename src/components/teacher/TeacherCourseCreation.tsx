
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApprovedSubject {
  id: string;
  subject: string;
  approved_at: string;
}

interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  price: number;
  audience: string;
  is_active: boolean;
  created_at: string;
}

export const TeacherCourseCreation: React.FC = () => {
  const [approvedSubjects, setApprovedSubjects] = useState<ApprovedSubject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    price: '',
    audience: '',
    session_duration_minutes: '60',
    total_sessions: '1'
  });

  useEffect(() => {
    fetchApprovedSubjects();
    fetchMyCourses();
  }, []);

  const fetchApprovedSubjects = async () => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('teacher_subjects')
        .select('*')
        .eq('teacher_id', currentUser.user?.id);

      if (error) throw error;
      setApprovedSubjects(data || []);
    } catch (error) {
      console.error('Error fetching approved subjects:', error);
      toast.error('Failed to load approved subjects');
    }
  };

  const fetchMyCourses = async () => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', currentUser.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('courses')
        .insert({
          title: formData.title,
          subject: formData.subject,
          description: formData.description,
          price: parseInt(formData.price) * 100, // Convert to cents
          audience: formData.audience,
          teacher_id: currentUser.user?.id,
          session_duration_minutes: parseInt(formData.session_duration_minutes),
          total_sessions: parseInt(formData.total_sessions)
        });

      if (error) throw error;

      toast.success('Course created successfully');
      setShowCreateForm(false);
      setFormData({
        title: '',
        subject: '',
        description: '',
        price: '',
        audience: '',
        session_duration_minutes: '60',
        total_sessions: '1'
      });
      fetchMyCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
    }
  };

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;

      toast.success(`Course ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchMyCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error('Failed to update course status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {approvedSubjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No approved subjects yet. Wait for admin approval.</p>
          </CardContent>
        </Card>
      )}

      {showCreateForm && approvedSubjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select approved subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.subject}>
                        {subject.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (EUR)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Audience</label>
                  <Select value={formData.audience} onValueChange={(value) => setFormData({...formData, audience: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Children</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Session Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.session_duration_minutes}
                    onChange={(e) => setFormData({...formData, session_duration_minutes: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Total Sessions</label>
                  <Input
                    type="number"
                    value={formData.total_sessions}
                    onChange={(e) => setFormData({...formData, total_sessions: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button type="submit">Create Course</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {courses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">My Courses</h3>
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.subject}</p>
                    <p className="text-sm mt-1">{course.description}</p>
                    <p className="text-sm mt-1">Price: €{(course.price / 100).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={course.is_active ? "default" : "secondary"}>
                      {course.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCourseStatus(course.id, course.is_active)}
                    >
                      {course.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
