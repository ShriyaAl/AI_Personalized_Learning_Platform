import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kguuiazbvyupsopfngky.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtndXVpYXpidnl1cHNvcGZuZ2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTYwODcsImV4cCI6MjA4Njk3MjA4N30.9s5YEiK0j38yTOubXvMix-XY1e0r_teXfItWtNOfvAM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
