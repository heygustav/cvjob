
import React from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { useAuth } from "@/components/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionStatus } from "@/services/subscription/types";

const Dashboard = () => {
  const { user } = useAuth();
  // Pass user object directly since useSubscription now accepts both User types
  const { subscriptionStatus, isLoading: isSubLoading } = useSubscription(user);
  
  const {
    jobPostings,
    coverLetters,
    isLoading,
    isDeleting,
    isRefreshing,
    deleteJobPosting,
    deleteCoverLetter,
    refreshData,
    findJobForLetter
  } = useDashboardData();

  if (isLoading || isSubLoading) {
    return <DashboardLoading />;
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
