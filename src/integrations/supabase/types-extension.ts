
import { Database as OriginalDatabase } from './types';

// Extend the original Database type to include our new tables and fields
export type Database = OriginalDatabase & {
  public: {
    Tables: {
      user_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          created_at: string;
          metadata: any;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          created_at?: string;
          metadata?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          created_at?: string;
          metadata?: any;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          created_at: string | null;
          role: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          created_at?: string | null;
          role?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          created_at?: string | null;
          role?: string;
        };
      };
      shows: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          image_url: string;
          price: number;
          available_seats: number;
          created_at: string | null;
          venue: string | null;
          category: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          image_url: string;
          price: number;
          available_seats: number;
          created_at?: string | null;
          venue?: string | null;
          category?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          image_url?: string;
          price?: number;
          available_seats?: number;
          created_at?: string | null;
          venue?: string | null;
          category?: string | null;
        };
      };
    };
  };
};

// Create a custom Supabase client type that uses our extended Database type
export type ExtendedSupabaseClient = ReturnType<typeof import('@supabase/supabase-js').createClient<Database>>;
