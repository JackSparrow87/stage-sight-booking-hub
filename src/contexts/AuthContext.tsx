
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, data: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  adminSignUp: (email: string, password: string, employeeNumber: string, data: any) => Promise<void>;
  adminSignIn: (email: string, password: string) => Promise<void>;
  validateAdminCode: (employeeNumber: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
        return;
      }
      
      if (data?.session) {
        setUser(data.session.user as User);
        
        // Check if user is admin
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        
        setIsAdmin(profileData?.role === 'admin');
      }
      
      setIsLoading(false);
    };
    
    checkSession();
    
    // Listen for authentication changes
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user as User);
        
        // Check if user is admin
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profileData?.role === 'admin');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Signup successful! Please verify your email.');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Successfully signed in!');
      navigate('/');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error(error.message);
        return;
      }
      
      // Reset user state immediately
      setUser(null);
      setIsAdmin(false);
      
      toast.success('Successfully signed out.');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const validateAdminCode = async (employeeNumber: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_codes')
        .select('*')
        .eq('employee_number', employeeNumber)
        .eq('used', false)
        .single();
      
      if (error || !data) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating admin code:', error);
      return false;
    }
  };
  
  const adminSignUp = async (email: string, password: string, employeeNumber: string, userData: any) => {
    try {
      setIsLoading(true);
      // First check if employee number is valid
      const { data: adminCode, error: codeError } = await supabase
        .from('admin_codes')
        .select('*')
        .eq('employee_number', employeeNumber)
        .eq('used', false)
        .single();
      
      if (codeError || !adminCode) {
        toast.error('Invalid employee number or already used.');
        throw new Error('Invalid employee number');
      }
      
      // Create the admin user with role set to admin
      const adminData = {
        ...userData,
        role: 'admin'
      };
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: adminData
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // Mark the admin code as used
      await supabase
        .from('admin_codes')
        .update({ used: true })
        .eq('id', adminCode.id);
      
      toast.success('Admin account created! Please verify your email.');
    } catch (error) {
      console.error('Admin signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const adminSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // Check if the user is an admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (profileError || profileData?.role !== 'admin') {
        await supabase.auth.signOut();
        toast.error('This account does not have admin privileges.');
        throw new Error('Not an admin account');
      }
      
      toast.success('Admin signed in successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Admin sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    adminSignUp,
    adminSignIn,
    validateAdminCode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
