
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from 'react-router-dom';

const signUpSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setLoading(true);
      
      // Create the user account
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: 'customer'
          }
        }
      });

      if (error) throw error;

      // Update the profile with additional information
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone || null
          } as any) // Using as any to bypass TypeScript for now
          .eq('id', user.id);
        
        if (profileError) console.error("Error updating profile:", profileError);
      }

      toast.success('Account created successfully! Please verify your email.');
      setMode('login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription className="text-center">
              {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {mode === 'signup' && (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" type="text" {...signUpForm.register("firstName")} />
                    {signUpForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" type="text" {...signUpForm.register("lastName")} />
                    {signUpForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="johndoe@example.com" type="email" {...signUpForm.register("email")} />
                  {signUpForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...signUpForm.register("password")} />
                  {signUpForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" placeholder="e.g., 123-456-7890" type="tel" {...signUpForm.register("phone")} />
                </div>
                <Button disabled={loading} className="w-full bg-theater-primary">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <div className="text-sm text-center">
                  Already have an account?{' '}
                  <Link to="#" onClick={() => setMode('login')} className="text-theater-primary hover:underline">
                    Log In
                  </Link>
                </div>
              </form>
            )}
            {mode === 'login' && (
              <form onSubmit={loginForm.handleSubmit(handleSignIn)} className="grid gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="johndoe@example.com" type="email" {...loginForm.register("email")} />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...loginForm.register("password")} />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button disabled={loading} className="w-full bg-theater-primary">
                  {loading ? 'Logging In...' : 'Log In'}
                </Button>
                <div className="text-sm text-center">
                  Don't have an account?{' '}
                  <Link to="#" onClick={() => setMode('signup')} className="text-theater-primary hover:underline">
                    Sign Up
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
