
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  logUserAction: (action: string, metadata?: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is admin
          setTimeout(async () => {
            const { data, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
              
            if (!error && data) {
              setIsAdmin(data.role === 'admin');
            }
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setIsAdmin(data.role === 'admin');
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Log user sign in
      await logUserAction('sign_in');
      
      toast.success('Successfully signed in');
      navigate('/');
    } catch (error: any) {
      toast.error(`Error signing in: ${error.message}`);
    }
  };

  const signUp = async (email: string, password: string, makeAdmin = false) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role: makeAdmin ? 'admin' : 'customer'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Log user sign up
      await logUserAction('sign_up');
      
      toast.success('Successfully signed up! Please check your email for confirmation.');
    } catch (error: any) {
      toast.error(`Error signing up: ${error.message}`);
    }
  };

  const signOut = async () => {
    try {
      // Log user sign out before actually signing out
      await logUserAction('sign_out');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success('Successfully signed out');
      navigate('/auth');
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  const logUserAction = async (action: string, metadata?: any) => {
    if (user) {
      try {
        await supabase.from('user_logs').insert({
          user_id: user.id,
          action,
          metadata: metadata || {}
        });
      } catch (error) {
        console.error('Error logging user action:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isAdmin,
      isLoading,
      signIn, 
      signUp, 
      signOut,
      logUserAction
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
