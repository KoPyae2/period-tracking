import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Period = {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  flow_level?: 'light' | 'medium' | 'heavy' | null;
  flow_intensity?: string;
  created_at: string;
};

export type Symptom = {
  id: string;
  user_id: string;
  date: string;
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes: string | null;
  created_at: string;
};

export type UserProfile = {
  id: string;
  email: string;
  average_cycle_length: number | null;
  last_period_start: string | null;
  cycle_history: Period[];
  created_at: string;
}; 