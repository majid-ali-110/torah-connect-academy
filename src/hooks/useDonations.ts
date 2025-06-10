
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Donation {
  id: string;
  donor_id: string;
  amount: number;
  donation_type: 'single_course' | 'multiple_courses' | 'custom';
  courses_sponsored: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  message?: string;
  created_at: string;
}

export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [availableSponsored, setAvailableSponsored] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('donor_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDonations(data || []);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableSponsored = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_available_sponsored_courses', { user_id: user.id });

        if (error) throw error;
        setAvailableSponsored(data || 0);
      } catch (error) {
        console.error('Error fetching available sponsored courses:', error);
      }
    };

    fetchDonations();
    fetchAvailableSponsored();
  }, [user?.id]);

  const createDonation = async (donationData: {
    amount: number;
    donation_type: string;
    courses_sponsored: number;
    message?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .insert({
        ...donationData,
        donor_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return {
    donations,
    availableSponsored,
    loading,
    createDonation
  };
};
