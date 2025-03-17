
import React, { useEffect, useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { useAuth } from "@/components/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionStatus } from "@/services/subscription/types";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
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
    isLoading,
    isDeleting,
    isRefreshing,
    deleteJobPosting,
    deleteCoverLetter,
    refreshData,
    findJobForLetter,
    error: dashboardError
  } = useDashboardData();

  // Set a timeout to detect if loading is taking too long
  useEffect(() => {
    if (isLoading || isSubLoading) {
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
        toast({
          title: "Indlæsning tager længere tid end forventet",
          description: "Der kan være problemer med serveradgang eller netværksforbindelse.",
          variant: "destructive",
        });
      }, 15000); // 15 second timeout
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, isSubLoading, toast]);

  // Handle retry when loading times out or there's an error
  const handleRetry = () => {
    if (user?.id) {
      fetchSubscriptionStatus(user.id);
    }
    refreshData();
    setLoadingTimeout(false);
  };

  if (isLoading || isSubLoading) {
    return <DashboardLoading />;
  }

  if (dashboardError || subError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Der opstod en fejl</AlertTitle>
            <AlertDescription>
              {dashboardError || subError || "Der opstod en fejl ved indlæsning af data. Prøv igen senere."}
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Prøv igen
          </Button>
        </div>
      </div>
    );
  }

  // Ensure job postings have default values for missing fields
  const processedJobPostings = jobPostings.map(job => ({
    ...job,
    title: job.title || "Untitled Position",
    company: job.company || "Unknown Company",
    description: job.description || "No description provided"
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <DashboardMain
        jobPostings={processedJobPostings}
        coverLetters={coverLetters}
        isDeleting={isDeleting}
        isRefreshing={isRefreshing}
        onJobDelete={deleteJobPosting}
        onLetterDelete={deleteCoverLetter}
        onRefresh={refreshData}
        findJobForLetter={findJobForLetter}
        subscriptionStatus={subscriptionStatus || undefined}
      />
    </div>
  );
};

export default Dashboard;
