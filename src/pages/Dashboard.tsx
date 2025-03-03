
import React from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import DashboardMain from "@/components/dashboard/DashboardMain";

const Dashboard = () => {
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

  if (isLoading) {
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
    <div className="min-h-screen bg-gray-50 py-20">
      <DashboardMain
        jobPostings={processedJobPostings}
        coverLetters={coverLetters}
        isDeleting={isDeleting}
        isRefreshing={isRefreshing}
        onJobDelete={deleteJobPosting}
        onLetterDelete={deleteCoverLetter}
        onRefresh={refreshData}
        findJobForLetter={findJobForLetter}
      />
    </div>
  );
};

export default Dashboard;
