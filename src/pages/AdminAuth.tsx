
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';

const AdminAuth = () => {
  const { user, signIn, signUp, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // The third parameter is set to true to make an admin user
    await signUp(email, password, true);
    setIsLoading(false);
  };

  // If already logged in but not admin, redirect to home
  if (user && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container-custom flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            <CardTitle className="text-center text-2xl">
              Admin Access
            </CardTitle>
          </div>
          <CardDescription className="text-center">
            Sign in or register as an administrator
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 mb-4 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="admin-email" className="text-sm font-medium">Email</label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="admin-password" className="text-sm font-medium">Password</label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-700 hover:bg-indigo-800"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login as Admin'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="admin-register-email" className="text-sm font-medium">Email</label>
                  <Input
                    id="admin-register-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="admin-register-password" className="text-sm font-medium">Password</label>
                  <Input
                    id="admin-register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-700 hover:bg-indigo-800"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Admin Account'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminAuth;
