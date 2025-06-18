import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    console.log('AuthPage: Checking if user is already authenticated', { 
      loading, 
      hasUser: !!user, 
      hasProfile: !!profile 
    });
    
    if (!loading && user && profile) {
      console.log('AuthPage: User already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, profile, loading, navigate, from]);

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student' as 'teacher' | 'student',
    gender: '' as string,
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('AuthPage: Attempting sign in');
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        console.error('AuthPage: Sign in error:', error);
        toast({
          title: t('common.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('AuthPage: Sign in successful');
        toast({
          title: t('common.success'),
          description: t('auth.welcome_back'),
        });
        // Navigation will be handled by useEffect when auth state updates
      }
    } catch (error) {
      console.error('AuthPage: Unexpected error:', error);
      toast({
        title: t('common.error'),
        description: t('errors.general'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('AuthPage: Attempting sign up');
      const { error } = await signUp(signUpData.email, signUpData.password, {
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        role: signUpData.role,
        gender: signUpData.gender,
      });
      
      if (error) {
        console.error('AuthPage: Sign up error:', error);
        toast({
          title: t('common.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('AuthPage: Sign up successful');
        toast({
          title: t('common.success'),
          description: t('auth.account_created'),
        });
      }
    } catch (error) {
      console.error('AuthPage: Unexpected error:', error);
      toast({
        title: t('common.error'),
        description: t('errors.general'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      console.log('AuthPage: Attempting Google sign in');
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('AuthPage: Google sign in error:', error);
        toast({
          title: t('common.error'),
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('AuthPage: Unexpected error:', error);
      toast({
        title: t('common.error'),
        description: t('errors.general'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication status
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">{t('auth.welcome_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">{t('auth.sign_in')}</TabsTrigger>
                  <TabsTrigger value="signup">{t('auth.sign_up')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <div className="space-y-4">
                    <Button
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {t('auth.continue_with_google')}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          {t('auth.or_continue_with_email')}
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <Label htmlFor="signin-email">{t('auth.email')}</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          value={signInData.email}
                          onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                          required
                          className="focus:ring-2 focus:ring-torah-500 transition-all"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signin-password">{t('auth.password')}</Label>
                        <Input
                          id="signin-password"
                          type="password"
                          value={signInData.password}
                          onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                          required
                          className="focus:ring-2 focus:ring-torah-500 transition-all"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-torah-500 hover:bg-torah-600 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? t('auth.signing_in') : t('auth.sign_in')}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
                
                <TabsContent value="signup">
                  <div className="space-y-4">
                    <Button
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {t('auth.continue_with_google')}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          {t('auth.or_continue_with_email')}
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="signup-firstname">{t('auth.first_name')}</Label>
                          <Input
                            id="signup-firstname"
                            value={signUpData.firstName}
                            onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                            required
                            className="focus:ring-2 focus:ring-torah-500 transition-all"
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-lastname">{t('auth.last_name')}</Label>
                          <Input
                            id="signup-lastname"
                            value={signUpData.lastName}
                            onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                            required
                            className="focus:ring-2 focus:ring-torah-500 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="signup-email">{t('auth.email')}</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                          required
                          className="focus:ring-2 focus:ring-torah-500 transition-all"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signup-password">{t('auth.password')}</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                          required
                          className="focus:ring-2 focus:ring-torah-500 transition-all"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signup-role">{t('auth.i_want_to')}</Label>
                        <Select value={signUpData.role} onValueChange={(value: 'teacher' | 'student') => setSignUpData({ ...signUpData, role: value })}>
                          <SelectTrigger className="focus:ring-2 focus:ring-torah-500 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">{t('auth.learn_torah')}</SelectItem>
                            <SelectItem value="teacher">{t('auth.teach_torah')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="signup-gender">{t('auth.select_gender')}</Label>
                        <Select value={signUpData.gender} onValueChange={(value: string) => setSignUpData({ ...signUpData, gender: value })}>
                          <SelectTrigger className="focus:ring-2 focus:ring-torah-500 transition-all">
                            <SelectValue placeholder={t('auth.select_gender')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">{t('auth.gender_male')}</SelectItem>
                            <SelectItem value="female">{t('auth.gender_female')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-torah-500 hover:bg-torah-600 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? t('auth.creating_account') : t('auth.create_account')}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AuthPage;
