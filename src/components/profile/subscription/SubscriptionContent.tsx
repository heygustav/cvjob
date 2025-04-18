
import React from "react";
import { User } from "@/lib/types";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionLoading from "./SubscriptionLoading";
import SubscriptionError from "./SubscriptionError";
import SubscriptionEmpty from "./SubscriptionEmpty";
import SubscriptionActive from "./SubscriptionActive";

interface SubscriptionContentProps {
  user: User;
  isProfileLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const SubscriptionContent: React.FC<SubscriptionContentProps> = ({
  user,
  isProfileLoading,
  error,
  onRefresh
}) => {
  const { 
    subscriptionStatus, 
    isLoading: isSubLoading,
    fetchSubscriptionStatus 
  } = useSubscription(user);

  if (isProfileLoading || isSubLoading) {
    return <SubscriptionLoading />;
  }

  if (error) {
    return <SubscriptionError onRetry={onRefresh} message={error} />;
  }

  if (!subscriptionStatus || !subscriptionStatus.subscription) {
    return (
      <SubscriptionEmpty 
        user={user}
        subscriptionStatus={subscriptionStatus}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <SubscriptionActive 
      user={user}
      subscriptionStatus={subscriptionStatus}
      onRefresh={onRefresh}
    />
  );
};

export default SubscriptionContent;
