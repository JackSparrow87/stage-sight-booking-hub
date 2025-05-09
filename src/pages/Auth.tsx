
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';

const Auth = () => {
  const { user, signIn, signUp, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const location = useLocation();

  // Check URL for admin parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('admin') === 'true') {
      setIsAdminMode(true);
    }
  }, [location]);

  // Redirect if already logged in
  if (user) {
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // The third parameter is for making an admin user
    await signUp(email, password, isAdminMode);
    setIsLoading(false);
  };

  return (
    <div className="container-custom flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center items-center gap-2">
            {isAdminMode && <Shield className="h-6 w-6 text-theater-primary" />}
            <CardTitle className="text-center text-2xl">
              {isAdminMode ? 'Admin Access' : 'Welcome'}
            </CardTitle>
          </div>
          <CardDescription className="text-center">
            {isAdminMode 
              ? 'Sign in or register as an administrator' 
              : 'Sign in to your account or create a new one'}
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
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
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
                  className={`w-full ${isAdminMode ? 'bg-indigo-700' : 'bg-theater-primary'}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : `Login${isAdminMode ? ' as Admin' : ''}`}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="register-email" className="text-sm font-medium">Email</label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-sm font-medium">Password</label>
                  <Input
                    id="register-password"
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
                  className={`w-full ${isAdminMode ? 'bg-indigo-700' : 'bg-theater-primary'}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : `Create ${isAdminMode ? 'Admin ' : ''}Account`}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
