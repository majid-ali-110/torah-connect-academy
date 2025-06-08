
import { supabase } from '@/integrations/supabase/client';

export const signInWithPassword = async (email: string, password: string) => {
  console.log('AuthOperations: Attempting sign in for:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('AuthOperations: Sign in result', { success: !!data.session, error });
    return { data, error };
  } catch (error) {
    console.error('AuthOperations: Error during sign in:', error);
    return { data: { user: null, session: null }, error };
  }
};

export const signUpWithPassword = async (email: string, password: string, userData: any) => {
  console.log('AuthOperations: Attempting sign up for:', email);
  
  try {
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
    
    console.log('AuthOperations: Sign up result', { success: !!data.user, error });
    return { data, error };
  } catch (error) {
    console.error('AuthOperations: Error during sign up:', error);
    return { data: { user: null, session: null }, error };
  }
};

export const signInWithGoogleOAuth = async () => {
  console.log('AuthOperations: Attempting Google sign in');
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error('AuthOperations: Error during Google sign in:', error);
    return { data: { user: null, session: null }, error };
  }
};

export const signOutUser = async () => {
  console.log('AuthOperations: Signing out user');
  
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('AuthOperations: Error during sign out:', error);
      throw error;
    }
    
    console.log('AuthOperations: Sign out successful');
    
    // Clear any cached data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
  } catch (error) {
    console.error('AuthOperations: Sign out failed:', error);
    throw error;
  }
};
