import React, { useEffect, useState, useMemo } from "react";
import { useDashboardData } from "@/hooks/dashboard";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { useAuth } from "@/components/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/errorHandling";
import ErrorDisplay from "@/components/ErrorDisplay";
import UsageStats from "@/components/dashboard/analytics/UsageStats";
import ActivityChart from "@/components/dashboard/analytics/ActivityChart";
import RecentActivity from "@/components/dashboard/analytics/RecentActivity";
import { format, subDays } from 'date-fns';

const LOADING_TIMEOUT_MS = 15000;

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { 
    subscriptionStatus, 
    isLoading: isSubLoading, 
    error: subError 
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

  useEffect(() => {
    if (!isLoading && !isSubLoading) {
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isSubLoading]);

  useEffect(() => {
    if (isLoading || isSubLoading) {
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

  const processJobPostings = () => {
    return jobPostings.map(job => ({
      ...job,
      title: job.title || "Untitled Position",
      company: job.company || "Unknown Company",
      description: job.description || "No description provided"
    }));
  };

  const handleRetry = () => {
    if (user?.id) {
      fetchSubscriptionStatus(user.id);
    }
    refreshData();
    setLoadingTimeout(false);
  };

  const activityData = React.useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'dd/MM');
    }).reverse();

    const letterCounts = days.map(day => 
      coverLetters.filter(letter => 
        format(new Date(letter.created_at), 'dd/MM') === day
      ).length
    );

    const jobCounts = days.map(day =>
      jobPostings.filter(job =>
        format(new Date(job.created_at), 'dd/MM') === day
      ).length
    );

    return {
      labels: days,
      letterCounts,
      jobCounts
    };
  }, [coverLetters, jobPostings]);

  const recentActivities = React.useMemo(() => {
    const allActivities = [
      ...coverLetters.map(letter => ({
        id: letter.id,
        type: 'letter' as const,
        title: 'Ny ansøgning oprettet',
        timestamp: letter.created_at
      })),
      ...jobPostings.map(job => ({
        id: job.id,
        type: 'job' as const,
        title: `Nyt jobopslag: ${job.title}`,
        timestamp: job.created_at
      })),
      ...companies.map(company => ({
        id: company.id,
        type: 'company' as const,
        title: `Ny virksomhed: ${company.name}`,
        timestamp: company.created_at
      }))
    ];

    return allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [coverLetters, jobPostings, companies]);

  if (initialLoading || isLoading || isSubLoading) {
    return (
      <div aria-live="polite" aria-busy="true">
        <DashboardLoading timeout={loadingTimeout} />
      </div>
    );
  }

  if (dashboardError || subError) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 space-y-8">
        <UsageStats
          totalLetters={coverLetters.length}
          totalJobs={jobPostings.length}
          totalCompanies={companies.length}
          generationsUsed={subscriptionStatus?.freeGenerationsUsed || 0}
          generationsAllowed={subscriptionStatus?.freeGenerationsAllowed || 0}
        />
        
        <div className="grid gap-4 md:grid-cols-4">
          <ActivityChart data={activityData} />
          <RecentActivity activities={recentActivities} />
        </div>

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
          subscriptionStatus={subscriptionStatus}
        />
      </div>
    </div>
  );
};

export default Dashboard;
