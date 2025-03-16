
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

  // Redirect based on session and redirectUrl
  useEffect(() => {
    // Only redirect if we have a new session and a redirect URL
    if (session && redirectUrl) {
      console.log("Auth: Redirecting to:", redirectUrl);
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectUrl);
      setRedirectUrl(null); // Clear the redirect URL after use
    }
  }, [session, navigate, redirectUrl]);

  return {
    session,
    user,
    isLoading,
    redirectUrl,
    attemptCount,
    setRedirectUrl,
    resetAttemptCount,
    setAttemptCount
  };
};
