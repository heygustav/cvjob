
import React, { createContext, useContext, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthState, AuthState, AuthActions } from '@/hooks/useAuthState';

interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Memoize the provider component to prevent unnecessary re-renders
export const AuthProvider: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const [state, actions] = useAuthState();

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({
    ...state,
    ...actions
  }), [state, actions]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
