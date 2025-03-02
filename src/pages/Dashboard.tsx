
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <DashboardMain
        jobPostings={jobPostings}
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
