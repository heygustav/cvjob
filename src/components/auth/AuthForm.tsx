
import React, { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useValidation } from './useValidation';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput } from '@/utils/security';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  isSignUp: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  attemptCount: number;
  toggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isSignUp,
  onSubmit,
  isLoading,
  attemptCount,
  toggleMode,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { errors, validateForm } = useValidation();
  const { toast } = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { email, password: '[REDACTED]' });
    
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    
    if (!validateForm(sanitizedEmail, sanitizedPassword)) {
      console.log("Validation failed", errors);
      return;
    }
    
    console.log("Validation passed, attempting to submit", { sanitizedEmail });
    
    try {
      await onSubmit(sanitizedEmail, sanitizedPassword);
    } catch (error) {
      console.error("Error in form submission:", error);
      // Error handling is managed in the parent component's handleAuthentication function
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && attemptCount <= 5) {
      if (email && password) {
        console.log("Enter key pressed, submitting form");
        handleSubmit(e as any);
      }
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-label={isSignUp ? "Opret konto formular" : "Login formular"}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`relative block w-full px-3 py-2 border ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent focus:z-10 sm:text-sm`}
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
          )}
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Adgangskode
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
              className={`relative block w-full px-3 py-2 border ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent focus:z-10 sm:text-sm pr-10`}
              placeholder="Adgangskode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Skjul adgangskode" : "Vis adgangskode"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">{errors.password}</p>
          )}
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isLoading || attemptCount > 5}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-opacity-90 transition-colors"
          aria-busy={isLoading ? "true" : "false"}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
          className="font-medium text-primary hover:text-primary-700 focus:outline-none focus:underline transition-colors"
          onClick={toggleMode}
        >
          {isSignUp
            ? 'Har du allerede en konto? Log ind'
            : 'Opret en ny konto'}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
