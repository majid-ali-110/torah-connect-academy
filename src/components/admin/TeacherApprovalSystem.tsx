
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Check, X, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PendingTeacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  subjects?: string[];
  experience?: string;
  created_at: string;
}

export const TeacherApprovalSystem: React.FC = () => {
  const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingTeachers(data || []);
    } catch (error) {
      console.error('Error fetching pending teachers:', error);
      toast.error('Failed to load pending teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (teacherId: string, action: 'approved' | 'rejected') => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: action,
          approved_by: currentUser.user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', teacherId);

      if (error) throw error;

      toast.success(`Teacher ${action} successfully`);
      fetchPendingTeachers();
    } catch (error) {
      console.error('Error updating teacher status:', error);
      toast.error('Failed to update teacher status');
    }
  };

  const approveSubjects = async (teacherId: string, subjects: string[]) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const subjectData = subjects.map(subject => ({
        teacher_id: teacherId,
        subject,
        approved_by: currentUser.user?.id
      }));

      const { error } = await supabase
        .from('teacher_subjects')
        .insert(subjectData);

      if (error) throw error;
      
      toast.success('Subjects approved successfully');
    } catch (error) {
      console.error('Error approving subjects:', error);
      toast.error('Failed to approve subjects');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading pending teachers...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Teacher Approval System</h2>
      
      {pendingTeachers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No pending teacher approvals</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingTeachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  {teacher.first_name} {teacher.last_name}
                  <Badge variant="secondary">Pending Approval</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p><strong>Email:</strong> {teacher.email}</p>
                  <p><strong>Applied:</strong> {new Date(teacher.created_at).toLocaleDateString()}</p>
                </div>
                
                {teacher.bio && (
                  <div>
                    <h4 className="font-semibold">Bio:</h4>
                    <p className="text-sm text-gray-600">{teacher.bio}</p>
                  </div>
                )}
                
                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Subjects:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {teacher.experience && (
                  <div>
                    <h4 className="font-semibold">Experience:</h4>
                    <p className="text-sm text-gray-600">{teacher.experience}</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      handleApproval(teacher.id, 'approved');
                      if (teacher.subjects) {
                        approveSubjects(teacher.id, teacher.subjects);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Approve Teacher
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleApproval(teacher.id, 'rejected')}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
