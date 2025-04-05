
import { createClient } from '@supabase/supabase-js';
import { Database } from './types-extension';

const SUPABASE_URL = "https://vnwzlahdmbxjoflsmnlj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZud3psYWhkbWJ4am9mbHNtbmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NzEzODcsImV4cCI6MjA1OTM0NzM4N30.dlWb8ZM8mFvyimk0kl8DvKq5UxJbink2rQuFL5XJvT8";

// Export the client with our extended types
export const supabaseExtended = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
