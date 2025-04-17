
import React from "react";
import ErrorDisplay from "@/components/ErrorDisplay";
import TechnicalInfo from "./TechnicalInfo";

interface StatusContainerProps {
  error: string | null;
  authStatus: string;
  dbStatus: string;
  browserInfo: string;
}

const StatusContainer: React.FC<StatusContainerProps> = ({
  error,
  authStatus,
  dbStatus,
  browserInfo
}) => {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <ErrorDisplay 
          title="Forbindelsesfejl" 
          message={error || "Der opstod en fejl ved forbindelsen til serveren."}
          onRetry={() => window.location.reload()}
          phase="user-fetch"
        />
        <TechnicalInfo
          authStatus={authStatus}
          dbStatus={dbStatus}
          browserInfo={browserInfo}
        />
      </div>
    </div>
  );
};

export default StatusContainer;
