
import React, { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { useSubscription } from "@/hooks/useSubscription";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SubscriptionLoading from "./SubscriptionLoading";
import SubscriptionError from "./SubscriptionError";
import SubscriptionEmpty from "./SubscriptionEmpty";
import SubscriptionActive from "./SubscriptionActive";

interface SubscriptionInfoProps {
  user: User;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ user }) => {
  const { subscriptionStatus, isLoading, error, fetchSubscriptionStatus } = useSubscription(user);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionStatus(user.id);
    }
  }, [user?.id, fetchSubscriptionStatus]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Fejl ved indlæsning af abonnement",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
        fetchSubscriptionStatus(user.id);
      }
    }
  }, [user?.id, fetchSubscriptionStatus, toast]);
  
  const handleRefresh = async () => {
    if (!user?.id) return;
    
    setIsRefreshing(true);
    try {
      await fetchSubscriptionStatus(user.id);
      toast({
        title: "Abonnement opdateret",
        description: "Abonnementsstatus er blevet opdateret.",
      });
    } catch (refreshError) {
      console.error("Error refreshing subscription:", refreshError);
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl ved opdatering af abonnementsstatus.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  if (isLoading) {
    return <SubscriptionLoading />;
  }

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
