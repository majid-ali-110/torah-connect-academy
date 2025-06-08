
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { validateEmail, validatePassword } from '@/utils/inputValidation';
import PasswordStrengthIndicator from '@/components/security/PasswordStrengthIndicator';
import SecureInput from '@/components/security/SecureInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const EnhancedAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { signIn, signUp } = useAuth();
  const { logSecurityEvent } = useSecurityMonitoring();

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Email validation
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Password validation
    if (!isLogin) {
      const { isValid: passwordValid, errors } = validatePassword(password);
      if (!passwordValid) {
        setPasswordError(errors.join(', '));
        isValid = false;
      } else if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        isValid = false;
      } else {
        setPasswordError('');
      }
    } else {
      if (password.length === 0) {
        setPasswordError('Password is required');
        isValid = false;
      } else {
        setPasswordError('');
      }
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
        await logSecurityEvent('login_attempt', { 
          success: true, 
          email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Partially mask email
        });
        toast.success('Successfully signed in!');
      } else {
        // Pass empty userData object as third parameter
        await signUp(email, password, {});
        await logSecurityEvent('login_attempt', { 
          success: true, 
          type: 'signup',
          email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
        });
        toast.success('Account created successfully! Please check your email for verification.');
      }
    } catch (error: any) {
      await logSecurityEvent('login_attempt', { 
        success: false, 
        error: error.message,
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      });
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {isLogin ? 'Sign In' : 'Create Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <SecureInput
                id="email"
                type="email"
                value={email}
                onSecureChange={setEmail}
                placeholder="Enter your email"
                required
                maxLength={254}
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <SecureInput
                id="password"
                type="password"
                value={password}
                onSecureChange={setPassword}
                placeholder="Enter your password"
                required
                maxLength={128}
              />
              {!isLogin && (
                <PasswordStrengthIndicator password={password} />
              )}
              {passwordError && (
                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <SecureInput
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onSecureChange={setConfirmPassword}
                  placeholder="Confirm your password"
                  required
                  maxLength={128}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading 
                ? (isLogin ? 'Signing in...' : 'Creating account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmailError('');
                  setPasswordError('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-sm text-torah-600 hover:text-torah-700"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAuthPage;
