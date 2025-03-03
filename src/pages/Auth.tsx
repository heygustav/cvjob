
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import DOMPurify from 'dompurify';

// Define validation schemas
const emailSchema = z.string().email('Ugyldig email adresse');
const passwordSchema = z.string().min(8, 'Adgangskode skal være mindst 8 tegn');

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [attemptCount, setAttemptCount] = useState(0);
  const { signIn, signUp, session, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for stored redirect URL on mount
  useEffect(() => {
    const storedRedirect = localStorage.getItem('redirectAfterLogin');
    if (storedRedirect) {
      // Sanitize the URL to prevent open redirect vulnerabilities
      const sanitizedUrl = DOMPurify.sanitize(storedRedirect);
      // Only accept internal URLs
      if (sanitizedUrl.startsWith('/') && !sanitizedUrl.includes('://')) {
        setRedirectUrl(sanitizedUrl);
        console.log("Auth: Found redirectUrl:", sanitizedUrl);
      } else {
        console.error("Invalid redirect URL detected and blocked:", storedRedirect);
      }
    }
  }, []);

  useEffect(() => {
    if (session) {
      // Redirect to stored URL if available, otherwise to dashboard
      if (redirectUrl) {
        console.log("Auth: Redirecting to:", redirectUrl);
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }
  }, [session, navigate, redirectUrl]);

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    
    try {
      emailSchema.parse(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.email = error.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.password = error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting to prevent brute force attacks
    if (attemptCount > 5) {
      toast({
        title: 'For mange forsøg',
        description: 'Du har foretaget for mange login-forsøg. Prøv igen senere.',
        variant: 'destructive',
      });
      return;
    }
    
    // Increment attempt counter
    setAttemptCount(prev => prev + 1);
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        
        toast({
          title: 'Konto oprettet',
          description: 'Din konto er oprettet. Tjek din e-mail for bekræftelse.',
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: 'Logget ind',
          description: 'Du er nu logget ind',
        });
        
        // Reset attempt counter on successful login
        setAttemptCount(0);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = 'Der opstod en fejl. Prøv igen senere.';
      
      if (error.message) {
        if (error.message.includes('Invalid login')) {
          errorMessage = 'Forkert e-mail eller adgangskode';
        } else if (error.message.includes('already registered')) {
          errorMessage = 'Denne e-mail er allerede registreret';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'For mange forsøg. Prøv igen senere.';
        } else {
          // Generic error message to avoid leaking implementation details
          errorMessage = 'Autentificering mislykkedes. Kontrollér dine oplysninger og prøv igen.';
        }
      }
      
      toast({
        title: 'Fejl',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Opret konto' : 'Log ind på din konto'}
          </h2>
          
          {redirectUrl && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                Log ind for at fortsætte til ansøgningsgeneratoren
              </p>
            </div>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                E-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Adgangskode
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Adgangskode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading || attemptCount > 5}
              className="group relative w-full flex justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Behandler...
                </span>
              ) : isSignUp ? (
                'Opret konto'
              ) : (
                'Log ind'
              )}
            </Button>
          </div>

          <div className="text-sm text-center">
            <button
              type="button"
              className="font-medium text-primary hover:text-primary-700"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? 'Har du allerede en konto? Log ind'
                : 'Opret en ny konto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
