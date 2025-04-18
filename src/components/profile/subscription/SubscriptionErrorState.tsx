
import React from "react";
import ErrorDisplay from "@/components/ErrorDisplay";
import StatusContainer from "@/components/profile/status/StatusContainer";

interface SubscriptionErrorStateProps {
  error: string | null;
  authStatus: string;
  dbStatus: string;
  browserInfo: string;
}

const SubscriptionErrorState: React.FC<SubscriptionErrorStateProps> = ({
  error,
  authStatus,
  dbStatus,
  browserInfo
}) => {
  return (
    <StatusContainer
      error={error}
      authStatus={authStatus}
      dbStatus={dbStatus}
      browserInfo={browserInfo}
    />
  );
};

export default SubscriptionErrorState;
