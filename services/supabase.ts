
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.0';

// Default keys are placeholders. Real keys should be injected via process.env
// If keys are missing, auth services will gracefully fail to "Offline Mode"
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
