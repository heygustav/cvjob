
import { useCallback, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { checkSubscriptionStatus, incrementGenerationCount } from "@/services/subscription/subscriptionService";
import { SubscriptionStatus } from "@/services/subscription/types";
import { useToast } from "@/hooks/use-toast";
import { User as SupabaseUser } from "@supabase/supabase-js";

// Accept either our custom User type or the Supabase User type
export const useSubscription = (user: User | SupabaseUser | null) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecordingGeneration, setIsRecordingGeneration] = useState(false);
  const { toast } = useToast();

  // Fetch subscription status
  const fetchSubscriptionStatus = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching subscription status for user:", userId);
      const status = await checkSubscriptionStatus(userId);
      console.log("Subscription status received:", status);
      setSubscriptionStatus(status);
      return status;
    } catch (err) {
      console.error("Error fetching subscription status:", err);
      const errorMessage = "Kunne ikke hente abonnementsstatus";
      setError(errorMessage);
      toast({
        title: "Fejl ved hentning af abonnement",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionStatus(user.id);
    }
  }, [user?.id, fetchSubscriptionStatus]);

  // Check if user can generate a cover letter
  const canGenerateLetter = useCallback((): boolean => {
    if (error) {
      console.warn("Error state present in subscription, defaulting to allow generation");
      return true; // If there's an error, we'll allow generation and let the backend handle actual limits
    }
    return subscriptionStatus?.canGenerate ?? false;
  }, [subscriptionStatus?.canGenerate, error]);

  // Record a generation
  const recordGeneration = useCallback(async (userId: string): Promise<boolean> => {
    if (isRecordingGeneration) {
      console.log("Already recording a generation, skipping duplicate request");
      return false;
    }
    
    setIsRecordingGeneration(true);
    
    try {
      console.log("Recording generation for user:", userId);
      await incrementGenerationCount(userId);
      
      // Update local state after recording generation
      console.log("Generation recorded, fetching updated subscription status");
      await fetchSubscriptionStatus(userId);
      
      return true;
    } catch (err) {
      console.error("Error recording generation:", err);
      toast({
        title: "Fejl",
        description: "Kunne ikke registrere generering, men fortsætter processen",
        variant: "destructive",
      });
      return true; // Return true so generation can continue despite recording issues
    } finally {
      setIsRecordingGeneration(false);
    }
  }, [fetchSubscriptionStatus, toast, isRecordingGeneration]);

  return {
    subscriptionStatus,
    isLoading,
    error,
    fetchSubscriptionStatus,
    canGenerateLetter,
    recordGeneration,
  };
};
