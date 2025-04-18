
import React from "react";
import { User } from "@/lib/types";
import ErrorDisplay from "@/components/ErrorDisplay";
import SubscriptionErrorState from "./SubscriptionErrorState";
import SubscriptionContent from "./SubscriptionContent";
import { useSubscriptionInfo } from "@/hooks/subscription/useSubscriptionInfo";

interface SubscriptionInfoProps {
  user: User;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ user }) => {
  const {
    error,
    authStatus,
    dbStatus,
    browserInfo,
    isRefreshing,
    setIsRefreshing,
    setError
  } = useSubscriptionInfo(user);

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <ErrorDisplay 
            title="Login påkrævet" 
            message="Du skal være logget ind for at se din profil."
            phase="user-fetch"
          />
        </div>
      </div>
    );
  }

  if (authStatus === "error" || dbStatus === "error") {
    return (
      <SubscriptionErrorState
        error={error}
        authStatus={authStatus}
        dbStatus={dbStatus}
        browserInfo={browserInfo}
      />
    );
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError(null);
  };

  return (
    <SubscriptionContent
      user={user}
      isProfileLoading={isRefreshing}
      error={error}
      onRefresh={handleRefresh}
    />
  );
};

export default SubscriptionInfo;
