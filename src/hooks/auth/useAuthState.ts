
import { useMemo } from 'react';
import { useAuthSession } from './useAuthSession';
import { useAuthLogic } from './authLogic';
import { AuthState, AuthActions } from './types';

export const useAuthState = (): [AuthState, AuthActions] => {
  const {
    session,
    user,
    isLoading,
    redirectUrl,
    attemptCount,
    isNewUser,
    setRedirectUrl,
    resetAttemptCount,
    setAttemptCount,
    setIsNewUser
  } = useAuthSession();

  // Compute isAuthenticated from session and user
  const isAuthenticated = useMemo(() => !!session && !!user, [session, user]);

  // Get auth actions
  const {
    signIn,
    signUp,
    signOut,
    handleAuthentication
  } = useAuthLogic(isLoading, attemptCount, redirectUrl, resetAttemptCount, setAttemptCount);

  // Create state object
  const state: AuthState = useMemo(() => ({
    session,
    user,
    isLoading,
    isAuthenticated,
    redirectUrl,
    attemptCount,
    isNewUser,
  }), [session, user, isLoading, isAuthenticated, redirectUrl, attemptCount, isNewUser]);

  // Create actions object
  const actions: AuthActions = useMemo(() => ({
    signIn,
    signUp,
    signOut,
    handleAuthentication,
    setRedirectUrl,
    resetAttemptCount,
    setIsNewUser,
  }), [signIn, signUp, signOut, handleAuthentication, setRedirectUrl, resetAttemptCount, setIsNewUser]);

  return [state, actions];
};

// Re-export the types for external use
export type { AuthState, AuthActions } from './types';
