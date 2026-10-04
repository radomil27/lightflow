/**
 * Lightflow - Supabase Client
 * 
 * Verwendet Umgebungsvariablen (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
 * Falls keine Keys hinterlegt sind, arbeitet die PWA vollautomatisch
 * mit dem lokalen Browser-Speicher weiter.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
