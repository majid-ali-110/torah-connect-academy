
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const useProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const createFallbackProfile = useCallback((user: User): Profile => {
    const now = new Date().toISOString();
    return {
      id: user.id,
      email: user.email!,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      role: user.user_metadata?.role || 'student',
      gender: user.user_metadata?.gender || '',
      preferred_language: 'en',
      is_fallback: true,
      created_at: now,
      updated_at: now
    };
  }, []);

  const fetchOrCreateProfile = useCallback(async (user: User, setLoading: (loading: boolean) => void) => {
    try {
      console.log('ProfileManager: Fetching profile for user:', user.id);
      
      const fallbackProfile = createFallbackProfile(user);

      const timeoutId = setTimeout(() => {
        console.log('ProfileManager: Profile fetch timeout, using fallback');
        setProfile(fallbackProfile);
        setLoading(false);
      }, 10000); // Increased timeout

      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        clearTimeout(timeoutId);

        if (error && error.code !== 'PGRST116') {
          console.error('ProfileManager: Error fetching profile:', error);
          setProfile(fallbackProfile);
          setLoading(false);
          return;
        }

        if (!profileData) {
          console.log('ProfileManager: Profile not found, creating new profile');
          const newProfile = {
            id: user.id,
            email: user.email!,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            role: user.user_metadata?.role || 'student',
            gender: user.user_metadata?.gender || '',
            preferred_language: 'en'
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .maybeSingle();

          if (createError) {
            console.error('ProfileManager: Error creating profile:', createError);
            setProfile(fallbackProfile);
          } else if (createdProfile) {
            console.log('ProfileManager: Profile created successfully:', createdProfile);
            setProfile(createdProfile as Profile);
          } else {
            setProfile(fallbackProfile);
          }
        } else {
          console.log('ProfileManager: Profile fetched successfully:', profileData);
          setProfile(profileData as Profile);
        }
      } catch (innerError) {
        clearTimeout(timeoutId);
        console.error('ProfileManager: Inner error in fetchOrCreateProfile:', innerError);
        setProfile(fallbackProfile);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('ProfileManager: Error in fetchOrCreateProfile:', error);
      const emergencyProfile = createFallbackProfile(user);
      setProfile(emergencyProfile);
      setLoading(false);
    }
  }, [createFallbackProfile]);

  const updateProfile = useCallback(async (user: User | null, updates: Partial<Profile>) => {
    if (!user) return;
    
    try {
      // Remove fields that don't exist in Supabase or have incompatible types
      const { is_fallback, ...supabaseUpdates } = updates;
      
      const { error } = await supabase
        .from('profiles')
        .update(supabaseUpdates as any)
        .eq('id', user.id);
      
      if (!error && profile) {
        setProfile({ ...profile, ...updates });
      } else if (error) {
        console.error('ProfileManager: Error updating profile:', error);
      }
    } catch (error) {
      console.error('ProfileManager: Error in updateProfile:', error);
    }
  }, [profile]);

  return {
    profile,
    setProfile,
    fetchOrCreateProfile,
    updateProfile,
  };
};
