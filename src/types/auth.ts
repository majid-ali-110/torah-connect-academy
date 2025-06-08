
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
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

export interface AuthContextType {
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
