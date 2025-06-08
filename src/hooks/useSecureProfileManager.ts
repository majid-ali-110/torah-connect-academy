
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';
import { sanitizeText } from '@/utils/inputSanitization';
import { supabase } from '@/integrations/supabase/client';

export const useSecureProfileManager = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const validateProfileData = (data: Partial<Profile>): string[] => {
    const errors: string[] = [];

    if (data.first_name && (data.first_name.length < 2 || data.first_name.length > 50)) {
      errors.push('First name must be between 2 and 50 characters');
    }

    if (data.last_name && (data.last_name.length < 2 || data.last_name.length > 50)) {
      errors.push('Last name must be between 2 and 50 characters');
    }

    if (data.bio && data.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    if (data.experience && data.experience.length > 1000) {
      errors.push('Experience must be less than 1000 characters');
    }

    if (data.hourly_rate && (data.hourly_rate < 1 || data.hourly_rate > 1000)) {
      errors.push('Hourly rate must be between $1 and $1000');
    }

    return errors;
  };

  const secureUpdateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) {
      toast.error('Authentication required');
      return false;
    }

    // Validate that user is only updating their own profile
    if (updates.id && updates.id !== user.id) {
      toast.error('Unauthorized: Cannot update another user\'s profile');
      return false;
    }

    // Validate input data
    const validationErrors = validateProfileData(updates);
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(', '));
      return false;
    }

    try {
      setSaving(true);

      // Sanitize text inputs
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.first_name) {
        sanitizedUpdates.first_name = sanitizeText(sanitizedUpdates.first_name);
      }
      if (sanitizedUpdates.last_name) {
        sanitizedUpdates.last_name = sanitizeText(sanitizedUpdates.last_name);
      }
      if (sanitizedUpdates.bio) {
        sanitizedUpdates.bio = sanitizeText(sanitizedUpdates.bio);
      }
      if (sanitizedUpdates.experience) {
        sanitizedUpdates.experience = sanitizeText(sanitizedUpdates.experience);
      }
      if (sanitizedUpdates.location) {
        sanitizedUpdates.location = sanitizeText(sanitizedUpdates.location);
      }

      // Remove incompatible fields for Supabase
      const { is_fallback, ...supabaseUpdates } = sanitizedUpdates;

      // Ensure user can only update their own profile
      const { error } = await supabase
        .from('profiles')
        .update(supabaseUpdates as any)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      await updateProfile(sanitizedUpdates);
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const secureDeleteProfile = async () => {
    if (!user || !profile) {
      toast.error('Authentication required');
      return false;
    }

    try {
      setLoading(true);
      
      // Mark profile as deleted rather than actually deleting
      const { error } = await supabase
        .from('profiles')
        .update({ 
          first_name: '[DELETED]',
          last_name: '[DELETED]',
          bio: null,
          avatar_url: null,
          email: '[DELETED]'
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile deletion requested');
      return true;
    } catch (error) {
      console.error('Error requesting profile deletion:', error);
      toast.error('Failed to process deletion request');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saving,
    secureUpdateProfile,
    secureDeleteProfile,
    validateProfileData
  };
};
