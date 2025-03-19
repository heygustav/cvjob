
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useAuthState, AuthState, AuthActions } from '@/hooks/auth/useAuthState';
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from './LoadingSpinner';

interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Memoize the provider component to prevent unnecessary re-renders
export const AuthProvider: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const [state, actions] = useAuthState();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if there's an existing session
        const { data } = await supabase.auth.getSession();
        console.log("Initial auth session:", data.session ? "Session exists" : "No session");
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({
    ...state,
    ...actions
  }), [state, actions]);

  // Show loading state until auth is initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Indlæser..." />
      </div>
    );
  }

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
