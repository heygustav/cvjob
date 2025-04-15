
import React, { useEffect, useState, useRef } from "react";
import { User } from "@/lib/types";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import SubscriptionLoading from "./SubscriptionLoading";
import SubscriptionError from "./SubscriptionError";
import SubscriptionEmpty from "./SubscriptionEmpty";
import SubscriptionActive from "./SubscriptionActive";
import { withTimeout } from "@/utils/errorHandling";
import { sanitizeInput } from "@/utils/security";

interface SubscriptionInfoProps {
  user: User;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ user }) => {
  const { subscriptionStatus, isLoading, error, fetchSubscriptionStatus } = useSubscription(user);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeoutError, setTimeoutError] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState(false);
  const { toast } = useToast();
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);
  
  // Initial fetch with timeout handling
  useEffect(() => {
    if (user?.id) {
      const fetchWithErrorHandling = async () => {
        setTimeoutError(null);
        setSecurityError(false);
        
        try {
          // Use withTimeout utility to handle timeouts consistently
          await withTimeout(
            fetchSubscriptionStatus(user.id),
            15000, // 15 second timeout
            "Kunne ikke hente abonnementsinformation inden for tidsfristen. Prøv igen senere."
          );
        } catch (err) {
          if (!mountedRef.current) return;
          
          console.error("Error fetching subscription with timeout:", err);
          
          // Check if it's a security-related error
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (
            errorMessage.toLowerCase().includes("security") || 
            errorMessage.toLowerCase().includes("csrf") || 
            errorMessage.toLowerCase().includes("xss") ||
            errorMessage.toLowerCase().includes("injection")
          ) {
            setSecurityError(true);
            setTimeoutError("Sikkerhedsrelateret fejl ved indlæsning af abonnement.");
          } else if (errorMessage.includes("timed out") || errorMessage.includes("timeout")) {
            setTimeoutError("Serveren svarer ikke. Prøv igen senere.");
          } else {
            // Sanitize any error messages before displaying them
            setTimeoutError(sanitizeInput(errorMessage));
          }
        }
      };
      
      fetchWithErrorHandling();
    }
  }, [user?.id, fetchSubscriptionStatus]);

  // Handle regular error display
  useEffect(() => {
    if (error && !timeoutError) {
      toast({
        title: "Fejl ved indlæsning af abonnement",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast, timeoutError]);

  // Handle URL parameters for subscription success/cancel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionParam = urlParams.get('subscription');
    
    if (subscriptionParam === 'success') {
      toast({
        title: "Abonnement oprettet",
        description: "Dit abonnement er blevet oprettet. Du har nu adgang til at generere ubegrænset ansøgninger.",
      });
      
      // Remove the subscription parameter from the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Refresh the subscription status
      if (user?.id) {
        console.log("Refreshing subscription status after successful checkout");
        fetchSubscriptionStatus(user.id);
      }
    }
  }, [user?.id, fetchSubscriptionStatus, toast]);
  
  const handleRefresh = async () => {
    if (!user?.id) return;
    
    setIsRefreshing(true);
    setTimeoutError(null);
    setSecurityError(false);
    
    console.log("Manually refreshing subscription status");
    
    try {
      // Set a timeout for the manual refresh operation
      const refreshPromise = fetchSubscriptionStatus(user.id);
      
      await withTimeout(
        refreshPromise,
        15000,
        "Opdatering tog for lang tid. Serveren kan være optaget. Prøv igen senere."
      );
      
      toast({
        title: "Abonnement opdateret",
        description: "Abonnementsstatus er blevet opdateret.",
      });
    } catch (refreshError) {
      console.error("Error refreshing subscription:", refreshError);
      
      // Handle specific error types
      const errorMessage = refreshError instanceof Error ? refreshError.message : String(refreshError);
      
      if (errorMessage.includes("timed out") || errorMessage.includes("timeout")) {
        toast({
          title: "Timeout ved opdatering",
          description: "Opdatering tog for lang tid. Serveren kan være optaget. Prøv igen senere.",
          variant: "destructive",
        });
        setTimeoutError("Timeout ved opdatering af abonnementsinformation");
      } else if (
        errorMessage.toLowerCase().includes("security") || 
        errorMessage.toLowerCase().includes("csrf") || 
        errorMessage.toLowerCase().includes("xss")
      ) {
        setSecurityError(true);
        toast({
          title: "Sikkerhedsfejl",
          description: "Der opstod en sikkerhedsrelateret fejl. Vi arbejder på at løse problemet.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fejl ved opdatering",
          description: sanitizeInput(errorMessage) || "Der opstod en fejl ved opdatering af abonnementsstatus.",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsRefreshing(false);
      }
    }
  };
  
  // Show loading state
  if (isLoading && !timeoutError) {
    return <SubscriptionLoading />;
  }

  // Show timeout or security error
  if (timeoutError) {
    return <SubscriptionError 
      onRetry={handleRefresh} 
      message={timeoutError}
      isSecurity={securityError}
    />;
  }
  
  // Show regular error
  if (error) {
    return <SubscriptionError onRetry={handleRefresh} />;
  }
  
  // No subscription or subscription data available
  if (!subscriptionStatus || !subscriptionStatus.subscription) {
    return (
      <SubscriptionEmpty 
        user={user}
        subscriptionStatus={subscriptionStatus}
        onRefresh={handleRefresh}
      />
    );
  }
  
  // Active subscription
  return (
    <SubscriptionActive 
      user={user}
      subscriptionStatus={subscriptionStatus}
      onRefresh={handleRefresh}
    />
  );
};

export default SubscriptionInfo;
