
import React, { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useValidation } from './useValidation';
import DOMPurify from 'dompurify';

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
  const { errors, validateForm } = useValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize inputs
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);
    
    if (!validateForm(sanitizedEmail, sanitizedPassword)) {
      return;
    }
    
    await onSubmit(sanitizedEmail, sanitizedPassword);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">
            E-mail
          </label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`rounded-none relative block w-full px-3 py-2 border ${
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
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            required
            className={`rounded-none relative block w-full px-3 py-2 border ${
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
