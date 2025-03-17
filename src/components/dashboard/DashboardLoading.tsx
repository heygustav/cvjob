
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";

const DashboardLoading: React.FC = () => {
  const [isLongLoading, setIsLongLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If loading takes more than 10 seconds, show loading timeout message
    const timeoutId = setTimeout(() => {
      setIsLongLoading(true);
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container py-12">
      <LoadingSpinner message="Indlæser dashboard..." />
      
      {isLongLoading && (
        <div className="mt-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Indlæsning tager længere tid end forventet</AlertTitle>
            <AlertDescription>
              Der kan være problemer med at indlæse data. Du kan prøve at opdatere siden, 
              eller gå tilbage til forsiden og prøve igen senere.
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
