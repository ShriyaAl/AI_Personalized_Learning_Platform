import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

// User-level client (Respects RLS)
export const supabase = createClient(config.supabase.url, config.supabase.key);

// Admin-level client (Bypasses RLS - Use for system tasks)
export const supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceKey);