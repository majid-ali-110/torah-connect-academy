
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import TeacherApprovalModal from './TeacherApprovalModal';

const TeacherApprovalList: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Profile[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Profile | null>(null);
  const [showModal, setShowModal] = useState(false);
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
        .in('approval_status', ['pending', 'rejected'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching pending teachers:', error);
      toast({
        title: t('common.error'),
        description: t('admin.fetch_teachers_error'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacherId: string, notes?: string) => {
    try {
      // Update teacher approval status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          approval_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', teacherId);

      if (updateError) throw updateError;

      // Log the approval action
      const { error: logError } = await supabase
        .from('admin_approvals')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          teacher_id: teacherId,
          action: 'approved',
          notes
        });

      if (logError) throw logError;

      toast({
        title: t('admin.teacher_approved'),
        description: t('admin.teacher_approved_desc')
      });

      fetchPendingTeachers();
    } catch (error) {
      console.error('Error approving teacher:', error);
      toast({
        title: t('common.error'),
        description: t('admin.approval_error'),
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (teacherId: string, notes?: string) => {
    try {
      // Update teacher approval status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          approval_status: 'rejected',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', teacherId);

      if (updateError) throw updateError;

      // Log the rejection action
      const { error: logError } = await supabase
        .from('admin_approvals')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          teacher_id: teacherId,
          action: 'rejected',
          notes
        });

      if (logError) throw logError;

      toast({
        title: t('admin.teacher_rejected'),
        description: t('admin.teacher_rejected_desc')
      });

      fetchPendingTeachers();
    } catch (error) {
      console.error('Error rejecting teacher:', error);
      toast({
        title: t('common.error'),
        description: t('admin.rejection_error'),
        variant: 'destructive'
      });
    }
  };

  const openModal = (teacher: Profile) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.pending_teachers')}</CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">{t('admin.no_pending_teachers')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-torah-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-torah-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {teacher.first_name} {teacher.last_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {teacher.email}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(teacher.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={teacher.approval_status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {t(`admin.status_${teacher.approval_status}`)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openModal(teacher)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t('admin.review')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TeacherApprovalModal
        teacher={selectedTeacher}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
};

export default TeacherApprovalList;
