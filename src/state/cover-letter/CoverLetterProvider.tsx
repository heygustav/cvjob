
import React, { useEffect } from 'react';
import { CoverLetterProvider as ContextProvider, useCoverLetterActions } from './CoverLetterContext';
import { CoverLetterState } from './types';
import { useAuth } from '@/components/AuthProvider';
import { useSubscription } from '@/hooks/useSubscription';

/**
 * Root provider component that initializes the cover letter state
 * and connects it with authentication and subscription data
 */
interface CoverLetterProviderProps {
  children: React.ReactNode;
  initialState?: Partial<CoverLetterState>;
}

export const CoverLetterProvider: React.FC<CoverLetterProviderProps> = ({ 
  children, 
  initialState 
}) => {
  return (
    <ContextProvider initialState={initialState}>
      <CoverLetterInitializer />
      {children}
    </ContextProvider>
  );
};

/**
 * Component that initializes user data and subscription status
 */
const CoverLetterInitializer: React.FC = () => {
  const { user: authUser } = useAuth();
  const { setUser, setSubscriptionStatus } = useCoverLetterActions();
  
  // Convert auth user to domain user
  useEffect(() => {
    if (authUser) {
      const domainUser = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || '',
        profileComplete: !!authUser.user_metadata?.profileComplete
      };
      
      setUser(domainUser);
    } else {
      setUser(null);
    }
  }, [authUser, setUser]);
  
  // Get subscription status for the user
  const { subscriptionStatus, fetchSubscriptionStatus } = useSubscription(authUser);
  
  // Set subscription status when it changes
  useEffect(() => {
    if (subscriptionStatus) {
      setSubscriptionStatus(subscriptionStatus);
    }
  }, [subscriptionStatus, setSubscriptionStatus]);
  
  // Fetch subscription status when user changes
  useEffect(() => {
    if (authUser?.id) {
      fetchSubscriptionStatus(authUser.id);
    }
  }, [authUser?.id, fetchSubscriptionStatus]);
  
  return null;
};
