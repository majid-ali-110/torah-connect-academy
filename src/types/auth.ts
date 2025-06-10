
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'teacher' | 'student' | 'admin';
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
  approval_status?: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  age_group?: string;
  learning_level?: string;
  phone?: string;
  time_zone?: string;
  trial_lessons_used?: number;
  max_trial_lessons?: number;
  created_at: string;
  updated_at: string;
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
