
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [teacherEarnings, setTeacherEarnings] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      // Fetch pending teachers
      const { data: teachers } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .eq('approval_status', 'pending');

      // Fetch teacher earnings
      const { data: earnings } = await supabase
        .from('teacher_earnings')
        .select(`
          *,
          teacher:profiles!teacher_id(first_name, last_name, email)
        `);

      // Fetch withdrawal requests
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select(`
          *,
          teacher:profiles!teacher_id(first_name, last_name, email)
        `)
        .eq('status', 'pending');

      setPendingTeachers(teachers || []);
      setTeacherEarnings(earnings || []);
      setWithdrawalRequests(withdrawals || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const approveTeacher = async (teacherId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', teacherId);

      if (error) throw error;

      toast({
        title: 'Teacher Approved',
        description: 'Teacher has been successfully approved.',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve teacher.',
        variant: 'destructive'
      });
    }
  };

  const rejectTeacher = async (teacherId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', teacherId);

      if (error) throw error;

      toast({
        title: 'Teacher Rejected',
        description: 'Teacher application has been rejected.',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject teacher.',
        variant: 'destructive'
      });
    }
  };

  const updateTeacherRate = async (teacherId: string, newRate: number) => {
    try {
      const { error } = await supabase
        .from('teacher_earnings')
        .insert({
          teacher_id: teacherId,
          course_id: null,
          payment_id: null,
          amount: 0,
          admin_set_rate: newRate / 100
        });

      if (error) throw error;

      toast({
        title: 'Rate Updated',
        description: `Teacher rate updated to ${newRate}%`,
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update teacher rate.',
        variant: 'destructive'
      });
    }
  };

  const approveWithdrawal = async (withdrawalId: string) => {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({
          status: 'completed',
          admin_approved_by: user.id,
          admin_approved_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (error) throw error;

      toast({
        title: 'Withdrawal Approved',
        description: 'Withdrawal request has been approved.',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve withdrawal.',
        variant: 'destructive'
      });
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Pending Teacher Approvals */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-6 w-6" />
            Pending Teacher Approvals ({pendingTeachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTeachers.length === 0 ? (
            <p className="text-gray-500">No pending teacher approvals</p>
          ) : (
            <div className="space-y-4">
              {pendingTeachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{teacher.first_name} {teacher.last_name}</h3>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                    <p className="text-sm">{teacher.bio}</p>
                    <div className="mt-2">
                      <Badge variant="outline">Subjects: {teacher.subjects?.join(', ')}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => approveTeacher(teacher.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => rejectTeacher(teacher.id)}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teacher Earnings Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-6 w-6" />
            Teacher Earnings Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(teacherEarnings.map(e => e.teacher_id))).map((teacherId) => {
              const teacher = teacherEarnings.find(e => e.teacher_id === teacherId)?.teacher;
              const currentRate = teacherEarnings.find(e => e.teacher_id === teacherId)?.admin_set_rate || 0.70;
              
              return (
                <div key={teacherId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{teacher?.first_name} {teacher?.last_name}</h3>
                    <p className="text-sm text-gray-600">Current Rate: {(currentRate * 100).toFixed(0)}%</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`rate-${teacherId}`}>New Rate (%)</Label>
                    <Input
                      id={`rate-${teacherId}`}
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={(currentRate * 100).toFixed(0)}
                      className="w-20"
                      onBlur={(e) => updateTeacherRate(teacherId, parseInt(e.target.value))}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawal Requests ({withdrawalRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawalRequests.length === 0 ? (
            <p className="text-gray-500">No pending withdrawal requests</p>
          ) : (
            <div className="space-y-4">
              {withdrawalRequests.map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{withdrawal.teacher?.first_name} {withdrawal.teacher?.last_name}</h3>
                    <p className="text-sm text-gray-600">Amount: €{(withdrawal.amount / 100).toFixed(2)}</p>
                    <p className="text-sm">Bank Account: {withdrawal.bank_account}</p>
                  </div>
                  <Button
                    onClick={() => approveWithdrawal(withdrawal.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
