
import React, { useEffect } from "react";
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
  
  if (isLoading) {
    return <SubscriptionLoading />;
  }

  if (error) {
    return <SubscriptionError onRetry={() => user?.id && fetchSubscriptionStatus(user.id)} />;
  }
  
  // No subscription or subscription data available
  if (!subscriptionStatus || !subscriptionStatus.subscription) {
    return (
      <SubscriptionEmpty 
        user={user}
        subscriptionStatus={subscriptionStatus}
        onRefresh={() => user?.id && fetchSubscriptionStatus(user.id)}
      />
    );
  }
  
  // Active subscription
  return (
    <SubscriptionActive 
      user={user}
      subscriptionStatus={subscriptionStatus}
      onRefresh={() => user?.id && fetchSubscriptionStatus(user.id)}
    />
  );
};

export default SubscriptionInfo;
