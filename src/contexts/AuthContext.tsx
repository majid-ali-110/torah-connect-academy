
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'teacher' | 'student';
  avatar_url?: string;
  bio?: string;
  subjects?: string[];
  languages?: string[];
  audiences?: string[];
  hourly_rate?: number;
  location?: string;
  experience?: string;
  education?: string[];
  availability_status?: 'available' | 'busy' | 'offline';
  gender?: string;
  preferred_language?: string;
  is_fallback?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener');
    
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthProvider: Initial session check', { sessionExists: !!session, error });
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
          setLoading(false);
          return;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          await fetchOrCreateProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('AuthProvider: Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state change', { event, sessionExists: !!session, userId: session?.user?.id });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await fetchOrCreateProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    getInitialSession();

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const fetchOrCreateProfile = async (user: User) => {
    try {
      console.log('AuthProvider: Fetching profile for user:', user.id);
      
      // Create fallback profile immediately as safety measure
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email!,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        role: user.user_metadata?.role || 'student',
        gender: user.user_metadata?.gender || '',
        preferred_language: 'en',
        is_fallback: true
      };

      // Set timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('AuthProvider: Profile fetch timeout, using fallback');
        setProfile(fallbackProfile);
        setLoading(false);
      }, 5000);

      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        clearTimeout(timeoutId);

        if (error && error.code === 'PGRST116') {
          console.log('AuthProvider: Profile not found, creating new profile');
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
            console.error('AuthProvider: Error creating profile:', createError);
            setProfile(fallbackProfile);
          } else {
            console.log('AuthProvider: Profile created successfully:', createdProfile);
            setProfile(createdProfile);
          }
        } else if (profileData) {
          console.log('AuthProvider: Profile fetched successfully:', profileData);
          setProfile(profileData);
        } else if (error) {
          console.error('AuthProvider: Error fetching profile:', error);
          setProfile(fallbackProfile);
        }
      } catch (innerError) {
        clearTimeout(timeoutId);
        console.error('AuthProvider: Inner error in fetchOrCreateProfile:', innerError);
        setProfile(fallbackProfile);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('AuthProvider: Error in fetchOrCreateProfile:', error);
      // Emergency fallback to prevent blocking
      const emergencyProfile: Profile = {
        id: user.id,
        email: user.email!,
        role: 'student',
        is_fallback: true
      };
      setProfile(emergencyProfile);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting sign in for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('AuthProvider: Sign in result', { success: !!data.session, error });
      
      if (data.session && data.user) {
        console.log('AuthProvider: Manually fetching profile after sign in');
        await fetchOrCreateProfile(data.user);
      } else {
        setLoading(false);
      }
      
      return { data, error };
    } catch (error) {
      console.error('AuthProvider: Error during sign in:', error);
      setLoading(false);
      return { data: { user: null, session: null }, error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('AuthProvider: Attempting sign up for:', email);
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          gender: userData.gender
        },
      },
    });
    
    console.log('AuthProvider: Sign up result', { success: !!data.user, error });
    
    if (error) {
      setLoading(false);
    }
    
    return { data, error };
  };

  const signInWithGoogle = async () => {
    console.log('AuthProvider: Attempting Google sign in');
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      setLoading(false);
    }
    
    return { data, error };
  };

  const signOut = async () => {
    console.log('AuthProvider: Signing out');
    setLoading(true);
    await supabase.auth.signOut();
    setProfile(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
