import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/database.types';

const supabaseUrl: string = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey: string = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);


