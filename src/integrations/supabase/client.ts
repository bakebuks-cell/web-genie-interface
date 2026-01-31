import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dpejmmiqxhjqvnstvazw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwZWptbWlxeGhqcXZuc3R2YXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNjI4MzYsImV4cCI6MjA4NDkzODgzNn0.1I9oDb2wFuuRhwrHAEKfq0-kFiO_E1i6KUF3VO3buxY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
