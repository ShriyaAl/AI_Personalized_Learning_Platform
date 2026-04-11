import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

// User-level client (Respects RLS)
export const supabase = createClient(config.supabase.url, config.supabase.key);

// Admin-level client (Bypasses RLS - Use for trusted server-side tasks).
// If service role key is not configured, fall back to normal key so server still boots.
const serverKey = config.supabase.serviceKey || config.supabase.key;

if (!config.supabase.serviceKey) {
  console.warn('WARNING: DATABASE_SERVICE_ROLE_KEY is missing; server routes may hit RLS restrictions.');
}

export const supabaseAdmin = createClient(config.supabase.url, serverKey);
