
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { sanitizeRedirectUrl } from './authUtils';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  // Reset attempt count
  const resetAttemptCount = useCallback(() => {
    setAttemptCount(0);
  }, []);

  // Retrieve stored redirect URL on mount
  useEffect(() => {
    const storedRedirect = localStorage.getItem('redirectAfterLogin');
    if (!storedRedirect) return;
    
    const sanitizedUrl = sanitizeRedirectUrl(storedRedirect);
    if (sanitizedUrl) {
      setRedirectUrl(sanitizedUrl);
      console.log("Auth: Found redirectUrl:", sanitizedUrl);
    } else {
      localStorage.removeItem('redirectAfterLogin');
    }
  }, []);

  // Initialize session and listen for auth state changes
  useEffect(() => {
    let mounted = true;
    
    // Check for active session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    getInitialSession();

    // Use the subscription for real-time updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      // Check if this is a new sign up
      if (event === 'SIGNED_IN' && !session?.user.last_sign_in_at) {
        setIsNewUser(true);
      }
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    // Cleanup on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Redirect based on session, redirectUrl, and whether user is new
  useEffect(() => {
    // Only redirect if we have a new session
    if (session && !isLoading) {
      // For new users, redirect to the quiz
      if (isNewUser) {
        console.log("Auth: New user detected, redirecting to quiz");
        navigate('/profile-quiz');
        setIsNewUser(false); // Reset the flag
        return;
      }
      
      // For returning users with a redirect URL
      if (redirectUrl) {
        console.log("Auth: Redirecting to:", redirectUrl);
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
        setRedirectUrl(null); // Clear the redirect URL after use
      }
    }
  }, [session, navigate, redirectUrl, isLoading, isNewUser]);

  return {
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
  };
};
