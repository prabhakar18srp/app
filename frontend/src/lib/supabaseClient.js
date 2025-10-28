import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://owiswasjugljbntqeuad.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93aXN3YXNqdWdsamJudHFldWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDcwMjcsImV4cCI6MjA3NjYyMzAyN30.sgozHolsvZ_Qykg6sNDBmBQsoyIndBMkdbZf1fFsy5A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : null,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
