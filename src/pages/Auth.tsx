
import React, { useState } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/components/AuthProvider';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { 
    redirectUrl, 
    isLoading,
    attemptCount,
    handleAuthentication
  } = useAuth();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (email: string, password: string) => {
    await handleAuthentication(email, password, isSignUp);
  };

  const pageTitle = isSignUp ? 'Opret konto' : 'Log ind på din konto';

  return (
    <AuthLayout title={pageTitle} redirectUrl={redirectUrl}>
      <AuthForm
        isSignUp={isSignUp}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        attemptCount={attemptCount}
        toggleMode={toggleMode}
      />
    </AuthLayout>
  );
};

export default Auth;
