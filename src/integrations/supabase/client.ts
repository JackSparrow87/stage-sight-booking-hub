// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vnwzlahdmbxjoflsmnlj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZud3psYWhkbWJ4am9mbHNtbmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NzEzODcsImV4cCI6MjA1OTM0NzM4N30.dlWb8ZM8mFvyimk0kl8DvKq5UxJbink2rQuFL5XJvT8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);