
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, MessageSquare, Settings, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface AdminStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalCourses: number;
  totalConversations: number;
  pendingTickets: number;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalConversations: 0,
    pendingTickets: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAdminData();
    }
  }, [profile]);

  const fetchAdminData = async () => {
    try {
      // Fetch user statistics
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*');

      const { data: courses } = await supabase
        .from('courses')
        .select('id');

      const { data: conversations } = await supabase
        .from('conversations')
        .select('id');

      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('status', 'open');

      if (profiles) {
        setUsers(profiles);
        setStats({
          totalUsers: profiles.length,
          totalTeachers: profiles.filter(p => p.role === 'teacher').length,
          totalStudents: profiles.filter(p => p.role === 'student').length,
          totalCourses: courses?.length || 0,
          totalConversations: conversations?.length || 0,
          pendingTickets: tickets?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const promoteToTeacher = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'teacher' })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert([{
          admin_id: user!.id,
          action_type: 'promote_to_teacher',
          target_user_id: userId,
          details: { action: 'Promoted user to teacher role' }
        }]);

      toast.success('User promoted to teacher successfully');
      fetchAdminData();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert([{
          admin_id: user!.id,
          action_type: 'delete_user',
          target_user_id: userId,
          details: { action: 'Deleted user account' }
        }]);

      toast.success('User deleted successfully');
      fetchAdminData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              Access denied. Admin privileges required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-torah-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tickets</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      user.role === 'admin' ? 'destructive' :
                      user.role === 'teacher' ? 'default' : 'secondary'
                    }>
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {user.role === 'student' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => promoteToTeacher(user.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Promote to Teacher
                    </Button>
                  )}
                  {user.role !== 'admin' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
