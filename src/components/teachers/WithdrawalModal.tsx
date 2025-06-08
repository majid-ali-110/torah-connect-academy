
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Wallet } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availableAmount, setAvailableAmount] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchAvailableEarnings();
    }
  }, [isOpen, user]);

  const fetchAvailableEarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_earnings')
        .select('amount')
        .eq('teacher_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      const total = data?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
      setAvailableAmount(total);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const amount = parseFloat(withdrawalAmount) * 100; // Convert to cents
    if (amount > availableAmount) {
      toast({
        title: 'Insufficient Funds',
        description: 'Withdrawal amount exceeds available earnings.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          teacher_id: user.id,
          amount: amount,
          bank_account: bankAccount,
          status: 'pending'
        });

      if (error) throw error;

      // Update earnings status to 'withdrawn'
      const { error: updateError } = await supabase
        .from('teacher_earnings')
        .update({ status: 'withdrawn' })
        .eq('teacher_id', user.id)
        .eq('status', 'pending');

      if (updateError) throw updateError;

      toast({
        title: 'Withdrawal Request Submitted',
        description: 'Your withdrawal request is pending admin approval.',
      });

      onClose();
      setWithdrawalAmount('');
      setBankAccount('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit withdrawal request.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            Request Withdrawal
          </DialogTitle>
        </DialogHeader>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="mr-2 h-5 w-5" />
              Available Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              €{(availableAmount / 100).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <form onSubmit={handleWithdrawal} className="space-y-4">
          <div>
            <Label htmlFor="amount">Withdrawal Amount (€) *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              max={availableAmount / 100}
              step="0.01"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="bankAccount">Bank Account Details *</Label>
            <Input
              id="bankAccount"
              placeholder="IBAN or account details"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || availableAmount === 0}>
              {loading ? 'Processing...' : 'Request Withdrawal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
