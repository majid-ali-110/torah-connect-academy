
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Settings, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SalarySettings {
  teacher_percentage: number;
  admin_percentage: number;
}

interface MonthlyPayment {
  id: string;
  teacher_id: string;
  teacher: {
    first_name: string;
    last_name: string;
    email: string;
  };
  month_year: string;
  total_hours: number;
  hourly_rate: number;
  gross_amount: number;
  teacher_amount: number;
  admin_amount: number;
  status: string;
}

interface PaymentCalculation {
  total_hours: number;
  hourly_rate: number;
  gross_amount: number;
  teacher_amount: number;
  admin_amount: number;
}

export const SalaryManagement: React.FC = () => {
  const [salarySettings, setSalarySettings] = useState<SalarySettings>({
    teacher_percentage: 0.70,
    admin_percentage: 0.30
  });
  const [pendingPayments, setPendingPayments] = useState<MonthlyPayment[]>([]);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );

  useEffect(() => {
    fetchSalarySettings();
    fetchPendingPayments();
  }, []);

  const fetchSalarySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_salary_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setSalarySettings({
          teacher_percentage: data[0].teacher_percentage,
          admin_percentage: data[0].admin_percentage
        });
      }
    } catch (error) {
      console.error('Error fetching salary settings:', error);
      toast.error('Failed to load salary settings');
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('monthly_teacher_payments')
        .select(`
          *,
          teacher:profiles!monthly_teacher_payments_teacher_id_fkey(first_name, last_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingPayments(data || []);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast.error('Failed to load pending payments');
    }
  };

  const updateSalarySettings = async () => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('teacher_salary_settings')
        .insert({
          teacher_percentage: salarySettings.teacher_percentage,
          admin_percentage: salarySettings.admin_percentage,
          updated_by: currentUser.user?.id
        });

      if (error) throw error;
      
      toast.success('Salary settings updated successfully');
    } catch (error) {
      console.error('Error updating salary settings:', error);
      toast.error('Failed to update salary settings');
    }
  };

  const generateMonthlyPayments = async () => {
    try {
      // First, get all teachers with teaching hours for the selected month
      const { data: teachers, error: teachersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, hourly_rate')
        .eq('role', 'teacher')
        .eq('approval_status', 'approved');

      if (teachersError) throw teachersError;

      for (const teacher of teachers || []) {
        // Calculate payment using the database function
        const { data: calculation, error: calcError } = await supabase
          .rpc('calculate_monthly_teacher_payment', {
            teacher_id_param: teacher.id,
            month_year_param: currentMonth
          });

        if (calcError) throw calcError;

        const paymentCalc = calculation as PaymentCalculation;

        if (paymentCalc.total_hours > 0) {
          // Insert payment record
          const { error: insertError } = await supabase
            .from('monthly_teacher_payments')
            .insert({
              teacher_id: teacher.id,
              month_year: currentMonth,
              total_hours: paymentCalc.total_hours,
              hourly_rate: paymentCalc.hourly_rate,
              gross_amount: paymentCalc.gross_amount,
              teacher_amount: paymentCalc.teacher_amount,
              admin_amount: paymentCalc.admin_amount
            });

          if (insertError) throw insertError;
        }
      }

      toast.success('Monthly payments generated successfully');
      fetchPendingPayments();
    } catch (error) {
      console.error('Error generating payments:', error);
      toast.error('Failed to generate monthly payments');
    }
  };

  const processPayment = async (paymentId: string) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('monthly_teacher_payments')
        .update({
          status: 'processed',
          processed_by: currentUser.user?.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;
      
      toast.success('Payment processed successfully');
      fetchPendingPayments();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Salary Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Salary Distribution Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Teacher Percentage</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={salarySettings.teacher_percentage}
                onChange={(e) => setSalarySettings({
                  ...salarySettings,
                  teacher_percentage: parseFloat(e.target.value),
                  admin_percentage: 1 - parseFloat(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Admin Percentage</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={salarySettings.admin_percentage}
                onChange={(e) => setSalarySettings({
                  ...salarySettings,
                  admin_percentage: parseFloat(e.target.value),
                  teacher_percentage: 1 - parseFloat(e.target.value)
                })}
              />
            </div>
          </div>
          <Button onClick={updateSalarySettings}>Update Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Generate Monthly Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Month</label>
            <Input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
            />
          </div>
          <Button onClick={generateMonthlyPayments}>Generate Payments for {currentMonth}</Button>
        </CardContent>
      </Card>

      {pendingPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        {payment.teacher.first_name} {payment.teacher.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">{payment.teacher.email}</p>
                      <p className="text-sm">Month: {payment.month_year}</p>
                      <p className="text-sm">Hours: {payment.total_hours}</p>
                      <p className="text-sm">Gross: €{(payment.gross_amount / 100).toFixed(2)}</p>
                      <p className="text-sm font-medium">Teacher Amount: €{(payment.teacher_amount / 100).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{payment.status}</Badge>
                      <Button
                        size="sm"
                        onClick={() => processPayment(payment.id)}
                      >
                        Process Payment
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
