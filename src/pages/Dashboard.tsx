
import React, { useEffect, useState } from "react";
import { useDashboardData } from "@/hooks/dashboard";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { useAuth } from "@/components/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/ErrorDisplay";
import { getErrorMessage } from "@/utils/errorHandling";

// Constants
const LOADING_TIMEOUT_MS = 15000; // Extended from 8 seconds to 15 seconds for better UX

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Pass user object directly since useSubscription now accepts both User types
  const { 
    subscriptionStatus, 
    isLoading: isSubLoading, 
    error: subError,
    fetchSubscriptionStatus 
  } = useSubscription(user);
  
  const {
    jobPostings,
    coverLetters,
    companies,
    isLoading,
    isDeleting,
    isRefreshing,
    deleteJobPosting,
    deleteCoverLetter,
    deleteCompany,
    refreshData,
    findJobForLetter,
    error: dashboardError
  } = useDashboardData();

  // Handle initial loading state with a delay to prevent flashing
  useEffect(() => {
    if (!isLoading && !isSubLoading) {
      // Add a small delay before hiding the loading state to ensure smooth transition
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isSubLoading]);

  // Set a timeout to detect if loading is taking too long
  useEffect(() => {
    if (isLoading || isSubLoading) {
      // Show initial feedback toast for better UX
      if (!loadingTimeout) {
        toast({
          title: "Indlæser data",
          description: "Vent venligst mens vi henter dine jobopslag og ansøgninger.",
        });
      }
      
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
        toast({
          title: "Indlæsning tager længere tid end forventet",
          description: "Der kan være problemer med serveradgang eller netværksforbindelse.",
          variant: "destructive",
        });
      }, LOADING_TIMEOUT_MS);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, isSubLoading, toast, loadingTimeout]);

  // Process job postings (moved to separate function for clarity)
  const processJobPostings = () => {
    return jobPostings.map(job => ({
      ...job,
      title: job.title || "Untitled Position",
      company: job.company || "Unknown Company",
      description: job.description || "No description provided"
    }));
  };

  // Handle retry when loading times out or there's an error
  const handleRetry = () => {
    if (user?.id) {
      fetchSubscriptionStatus(user.id);
    }
    refreshData();
    setLoadingTimeout(false);
  };

  // Render loading state
  if (initialLoading || isLoading || isSubLoading) {
    return (
      <div aria-live="polite" aria-busy="true">
        <DashboardLoading timeout={loadingTimeout} />
      </div>
    );
  }

  // Render error state
  if (dashboardError || subError) {
    // Get the error message safely
    const errorMessage = dashboardError 
      ? getErrorMessage(dashboardError)
      : getErrorMessage(subError);
      
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <ErrorDisplay
            title="Fejl ved indlæsning af data"
            message={errorMessage}
            phase="network"
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  // Render main dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <DashboardMain
        jobPostings={processJobPostings()}
        coverLetters={coverLetters}
        companies={companies}
        isDeleting={isDeleting}
        isRefreshing={isRefreshing}
        onJobDelete={deleteJobPosting}
        onLetterDelete={deleteCoverLetter}
        onCompanyDelete={deleteCompany}
        onRefresh={refreshData}
        findJobForLetter={findJobForLetter}
        subscriptionStatus={subscriptionStatus || undefined}
      />
    </div>
  );
};

export default Dashboard;
