
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import ErrorDisplay from "@/components/ErrorDisplay";

interface DashboardLoadingProps {
  timeout?: boolean;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ timeout = false }) => {
  const [isLongLoading, setIsLongLoading] = useState(timeout);
  const [isTimeout, setIsTimeout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If loading takes more than 5 seconds, show loading timeout message
    const longTimeoutId = setTimeout(() => {
      setIsLongLoading(true);
    }, 5000);
    
    // If loading takes more than 20 seconds, show timeout message
    const timeoutId = setTimeout(() => {
      setIsTimeout(true);
    }, 20000);

    return () => {
      clearTimeout(longTimeoutId);
      clearTimeout(timeoutId);
    };
  }, []);

  // Update internal state when prop changes
  useEffect(() => {
    if (timeout) {
      setIsLongLoading(true);
    }
  }, [timeout]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <LoadingSpinner message="Indlæser dashboard..." />
      
      {isLongLoading && (
        <div className="mt-6 max-w-md w-full">
          {isTimeout ? (
            <ErrorDisplay
              title="Timeout ved indlæsning"
              message="Der er opstået et problem med indlæsningen af data. Prøv venligst at opdatere siden eller gå tilbage til forsiden."
              phase="timeout"
              onRetry={handleRefresh}
            />
          ) : (
            <ErrorDisplay
              title="Indlæsning tager længere tid end forventet"
              message="Der kan være problemer med at indlæse data. Du kan prøve at opdatere siden, eller gå tilbage til forsiden og prøve igen senere."
              phase="network"
              onRetry={handleRefresh}
            />
          )}
          
          <div className="flex justify-center gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              Gå til forsiden
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLoading;
