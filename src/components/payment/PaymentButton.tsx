
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  courseId: string;
  price: number;
  currency?: string;
  isLiveClass?: boolean;
  isFree?: boolean;
  children?: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  courseId,
  price,
  currency = 'eur',
  isLiveClass = false,
  isFree = false,
  children
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to enroll in courses.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { courseId, isLiveClass }
      });

      if (error) throw error;

      if (data.free) {
        toast({
          title: 'Enrollment Successful',
          description: 'You have been enrolled in this free course!',
        });
        window.location.reload();
        return;
      }

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to process payment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-torah-500 hover:bg-torah-600"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4 mr-2" />
      )}
      {children || (isFree ? 'Enroll Free' : `Pay €${(price / 100).toFixed(2)}`)}
    </Button>
  );
};

export default PaymentButton;
