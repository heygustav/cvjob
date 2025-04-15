
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLoadingProps {
  timeout?: boolean;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ timeout = false }) => {
  const [isLongLoading, setIsLongLoading] = useState(timeout);
  const [isTimeout, setIsTimeout] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Show skeleton loading immediately for better UX
    setShowSkeleton(true);
    
    // If loading takes more than 10 seconds (previously 5), show loading timeout message
    const longTimeoutId = setTimeout(() => {
      setIsLongLoading(true);
      // Gradually fade out skeleton after showing the long loading message
      setTimeout(() => setShowSkeleton(false), 500);
    }, 10000);
    
    // If loading takes more than 30 seconds (previously 20), show timeout message
    const timeoutId = setTimeout(() => {
      setIsTimeout(true);
      setShowSkeleton(false);
    }, 30000);

    return () => {
      clearTimeout(longTimeoutId);
      clearTimeout(timeoutId);
    };
  }, []);

  // Update internal state when prop changes
  useEffect(() => {
    if (timeout) {
      setIsLongLoading(true);
      setShowSkeleton(false);
    }
  }, [timeout]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      {showSkeleton ? (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in-50 duration-500">
          <DashboardSkeleton />
        </div>
      ) : (
        <LoadingSpinner message="Indlæser dashboard..." />
      )}
      
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

// Skeleton component for dashboard loading state
const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Tab navigation skeleton */}
      <div className="flex space-x-2 border-b pb-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-28" />
      </div>
      
      {/* Actions row skeleton */}
      <div className="flex space-x-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
      
      {/* Content skeleton - like a table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        {/* Repeat for multiple rows */}
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLoading;
