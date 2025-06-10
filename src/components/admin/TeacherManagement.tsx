
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTeacherHours } from '@/hooks/useTeacherHours';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, User, BookOpen } from 'lucide-react';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  subjects?: string[];
  experience?: string;
  approval_status: string;
  created_at: string;
}

export const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const { hours: teacherHours, totalHours } = useTeacherHours(selectedTeacher?.id);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (teacherId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          approval_status: action,
          approved_at: action === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', teacherId);

      if (error) throw error;

      toast.success(`Teacher ${action} successfully`);
      fetchTeachers();
    } catch (error) {
      console.error('Error updating teacher status:', error);
      toast.error('Failed to update teacher status');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading teachers...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Teacher Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Teachers List</h2>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTeacher(teacher)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {teacher.first_name} {teacher.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                      {teacher.subjects && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {teacher.subjects.slice(0, 3).map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={
                        teacher.approval_status === 'approved' ? 'default' :
                        teacher.approval_status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {teacher.approval_status}
                      </Badge>
                      {teacher.approval_status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproval(teacher.id, 'approved');
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproval(teacher.id, 'rejected');
                            }}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {selectedTeacher && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Teacher Details</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {selectedTeacher.first_name} {selectedTeacher.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p><strong>Email:</strong> {selectedTeacher.email}</p>
                  <p><strong>Status:</strong> {selectedTeacher.approval_status}</p>
                  <p><strong>Joined:</strong> {new Date(selectedTeacher.created_at).toLocaleDateString()}</p>
                </div>

                {selectedTeacher.bio && (
                  <div>
                    <h4 className="font-semibold">Bio:</h4>
                    <p className="text-sm text-gray-600">{selectedTeacher.bio}</p>
                  </div>
                )}

                {selectedTeacher.subjects && (
                  <div>
                    <h4 className="font-semibold">Subjects:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTeacher.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTeacher.experience && (
                  <div>
                    <h4 className="font-semibold">Experience:</h4>
                    <p className="text-sm text-gray-600">{selectedTeacher.experience}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    Teaching Hours Summary
                  </h4>
                  <p className="text-lg font-medium">Total Hours: {totalHours.toFixed(1)}</p>
                  
                  {teacherHours.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h5 className="font-medium">Recent Sessions:</h5>
                      {teacherHours.slice(0, 5).map((hour) => (
                        <div key={hour.id} className="text-sm bg-gray-50 p-2 rounded">
                          <div className="flex justify-between">
                            <span>{hour.session?.course?.title}</span>
                            <span>{hour.hours_taught}h</span>
                          </div>
                          <div className="text-gray-600">
                            {new Date(hour.date_taught).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
