
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { checkSubscriptionStatus, incrementGenerationCount } from "@/services/coverLetter/database";
import { SubscriptionStatus } from "@/services/subscription/types";
import { useToast } from "@/hooks/use-toast";

export const useSubscription = (user: User | null) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch subscription status
  const fetchSubscriptionStatus = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const status = await checkSubscriptionStatus(userId);
      setSubscriptionStatus(status);
      return status;
    } catch (err) {
      console.error("Error fetching subscription status:", err);
      setError("Kunne ikke hente abonnementsstatus");
      toast({
        title: "Fejl",
        description: "Kunne ikke hente abonnementsstatus",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user can generate a cover letter
  const canGenerateLetter = (): boolean => {
    return subscriptionStatus?.canGenerate ?? false;
  };

  // Record a generation
  const recordGeneration = async (userId: string): Promise<boolean> => {
    try {
      await incrementGenerationCount(userId);
      // Update local state after recording generation
      await fetchSubscriptionStatus(userId);
      return true;
    } catch (err) {
      console.error("Error recording generation:", err);
      toast({
        title: "Fejl",
        description: "Kunne ikke registrere generering",
        variant: "destructive",
      });
      return false;
    }
  };

  // Initial fetch when user is loaded
  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionStatus(user.id);
    } else {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    subscriptionStatus,
    isLoading,
    error,
    fetchSubscriptionStatus,
    canGenerateLetter,
    recordGeneration,
  };
};
