
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const useProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const createFallbackProfile = useCallback((user: User): Profile => {
    return {
      id: user.id,
      email: user.email!,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      role: user.user_metadata?.role || 'student',
      gender: user.user_metadata?.gender || '',
      preferred_language: 'en',
      is_fallback: true
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
      }, 5000);

      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        clearTimeout(timeoutId);

        if (error && error.code === 'PGRST116') {
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
            .single();

          if (createError) {
            console.error('ProfileManager: Error creating profile:', createError);
            setProfile(fallbackProfile);
          } else {
            console.log('ProfileManager: Profile created successfully:', createdProfile);
            setProfile(createdProfile as Profile);
          }
        } else if (profileData) {
          console.log('ProfileManager: Profile fetched successfully:', profileData);
          setProfile(profileData as Profile);
        } else if (error) {
          console.error('ProfileManager: Error fetching profile:', error);
          setProfile(fallbackProfile);
        } else {
          console.log('ProfileManager: No profile found, using fallback');
          setProfile(fallbackProfile);
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
    
    // Convert our Profile type to match Supabase expected format
    // Remove any fields that don't exist in Supabase or have incompatible types
    const { is_fallback, ...supabaseUpdates } = updates;
    
    // Handle role field specifically - only pass roles that Supabase expects
    if (supabaseUpdates.role === 'admin') {
      // For admin role, we might want to handle this differently
      // For now, let's not update the role in Supabase if it's admin
      delete supabaseUpdates.role;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(supabaseUpdates as any)
      .eq('id', user.id);
    
    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }
  }, [profile]);

  return {
    profile,
    setProfile,
    fetchOrCreateProfile,
    updateProfile,
  };
};
