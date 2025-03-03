
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuthHandler } from '@/hooks/useAuthHandler';

const Auth = () => {
  const { 
    isSignUp,
    redirectUrl, 
    isLoading,
    attemptCount,
    toggleMode,
    handleAuthentication
  } = useAuthHandler();

  const pageTitle = isSignUp ? 'Opret konto' : 'Log ind på din konto';

  return (
    <AuthLayout title={pageTitle} redirectUrl={redirectUrl}>
      <AuthForm
        isSignUp={isSignUp}
        onSubmit={handleAuthentication}
        isLoading={isLoading}
        attemptCount={attemptCount}
        toggleMode={toggleMode}
      />
    </AuthLayout>
  );
};

export default Auth;
