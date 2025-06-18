
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, Profile } from '@/types/auth';
import { useProfileManager } from '@/hooks/useProfileManager';
import { 
  signInWithPassword, 
  signUpWithPassword, 
  signInWithGoogleOAuth, 
  signOutUser 
} from '@/utils/authOperations';

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
  const [loading, setLoading] = useState(true);
  
  const { profile, setProfile, fetchOrCreateProfile, updateProfile: updateUserProfile } = useProfileManager();

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

        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await fetchOrCreateProfile(session.user, setLoading);
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
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            await fetchOrCreateProfile(session.user, setLoading);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
            setLoading(false);
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error('AuthProvider: Error in auth state change:', error);
          setLoading(false);
        }
      }
    );

    getInitialSession();

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [fetchOrCreateProfile, setProfile]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const result = await signInWithPassword(email, password);
      
      if (result.data.session && result.data.user) {
        console.log('AuthProvider: Manually fetching profile after sign in');
        await fetchOrCreateProfile(result.data.user, setLoading);
      } else {
        setLoading(false);
      }
      
      return result;
    } catch (error) {
      console.error('AuthProvider: Error during sign in:', error);
      setLoading(false);
      return { data: { user: null, session: null }, error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    
    try {
      const result = await signUpWithPassword(email, password, userData);
      
      if (result.error) {
        setLoading(false);
      }
      
      return result;
    } catch (error) {
      console.error('AuthProvider: Error during sign up:', error);
      setLoading(false);
      return { data: { user: null, session: null }, error };
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    
    try {
      const result = await signInWithGoogleOAuth();
      
      if (result.error) {
        setLoading(false);
      }
      
      return result;
    } catch (error) {
      console.error('AuthProvider: Error during Google sign in:', error);
      setLoading(false);
      return { data: { user: null, session: null }, error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setProfile(null);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('AuthProvider: Error during sign out:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      await updateUserProfile(user, updates);
    } catch (error) {
      console.error('AuthProvider: Error updating profile:', error);
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
