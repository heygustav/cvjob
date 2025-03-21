import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";

interface DashboardLoadingProps {
  timeout?: boolean;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ timeout = false }) => {
  const [isLongLoading, setIsLongLoading] = useState(timeout);
  const [isTimeout, setIsTimeout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If loading takes more than 5 seconds, show loading timeout message (reduced from 10s)
    const longTimeoutId = setTimeout(() => {
      setIsLongLoading(true);
    }, 5000);
    
    // If loading takes more than 20 seconds, show timeout message (reduced from 30s)
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
        <div className="mt-6 max-w-md">
          <Alert variant={isTimeout ? "destructive" : "default"} className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{isTimeout ? "Timeout ved indlæsning" : "Indlæsning tager længere tid end forventet"}</AlertTitle>
            <AlertDescription>
              {isTimeout 
                ? "Der er opstået et problem med indlæsningen af data. Prøv venligst at opdatere siden eller gå tilbage til forsiden."
                : "Der kan være problemer med at indlæse data. Du kan prøve at opdatere siden, eller gå tilbage til forsiden og prøve igen senere."
              }
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Opdater siden
            </Button>
            
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
