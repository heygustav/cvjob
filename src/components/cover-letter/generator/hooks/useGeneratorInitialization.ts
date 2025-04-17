
import { useEffect } from 'react';
import { useGeneratorContext } from '../context/GeneratorContext';
import { useAuth } from '@/components/AuthProvider';
import { User } from '@/lib/types';
import { useSubscription } from '@/hooks/useSubscription';

export const useGeneratorInitialization = (existingLetterId?: string) => {
  const { state, dispatch } = useGeneratorContext();
  const { user: authUser } = useAuth();
  
  // Convert Supabase user to our app's User type
  const completeUser: User | null = authUser ? {
    id: authUser.id,
    email: authUser.email || "",
    name: authUser.user_metadata?.name || "",
    profileComplete: false
  } : null;
  
  // Set the user in context
  useEffect(() => {
    if (completeUser) {
      dispatch({ type: 'SET_COMPLETE_USER', payload: completeUser });
    }
  }, [completeUser, dispatch]);

  // Get subscription status
  const { subscriptionStatus, fetchSubscriptionStatus } = useSubscription(completeUser);
  
  // Set subscription status in context
  useEffect(() => {
    if (subscriptionStatus) {
      dispatch({ type: 'SET_SUBSCRIPTION_STATUS', payload: subscriptionStatus });
    }
  }, [subscriptionStatus, dispatch]);

  // Fetch subscription status on mount
  useEffect(() => {
    if (completeUser?.id) {
      fetchSubscriptionStatus(completeUser.id);
    }
  }, [completeUser?.id, fetchSubscriptionStatus]);

  // Handle URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const jobId = searchParams.get("jobId");
    const letterId = searchParams.get("letterId") || existingLetterId;
    const stepParam = searchParams.get("step");
    
    // If stepParam is provided and valid, set it
    if (stepParam === "1" || stepParam === "2") {
      dispatch({ type: 'SET_STEP', payload: parseInt(stepParam) as 1 | 2 });
    }
    
    // If jobId or letterId is provided, we could fetch them here
    // This would replace the fetchJob and fetchLetter functionality
    
  }, [dispatch, existingLetterId]);

  return {
    completeUser,
    subscriptionStatus
  };
};
