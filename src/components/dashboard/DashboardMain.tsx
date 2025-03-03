
import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardActions from "@/components/dashboard/DashboardActions";
import DashboardContent from "@/components/dashboard/DashboardContent";
import TabNav from "@/components/dashboard/TabNav";
import { SubscriptionStatus } from "@/services/subscription/types";

interface DashboardMainProps {
  jobPostings: any[];
  coverLetters: any[];
  isDeleting: boolean;
  isRefreshing: boolean;
  onJobDelete: (id: string) => void;
  onLetterDelete: (id: string) => void;
  onRefresh: () => void;
  findJobForLetter: (jobPostingId: string) => any | undefined;
  subscriptionStatus?: SubscriptionStatus;
}

const DashboardMain: React.FC<DashboardMainProps> = ({
  jobPostings,
  coverLetters,
  isDeleting,
  isRefreshing,
  onJobDelete,
  onLetterDelete,
  onRefresh,
  findJobForLetter,
  subscriptionStatus
}) => {
  const [activeTab, setActiveTab] = useState<"letters" | "jobs">("letters");

  const handleTabChange = (tab: "letters" | "jobs") => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <DashboardHeader 
        jobCount={jobPostings.length}
        letterCount={coverLetters.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isRefreshing}
        subscriptionStatus={subscriptionStatus}
      />

      <div className="mb-6">
        <TabNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      <div className="flex justify-end mb-6">
        <DashboardActions 
          activeTab={activeTab}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </div>

      <DashboardContent 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        jobPostings={jobPostings}
        coverLetters={coverLetters}
        isDeleting={isDeleting}
        onJobDelete={onJobDelete}
        onLetterDelete={onLetterDelete}
        findJobForLetter={findJobForLetter}
      />
    </div>
  );
};

export default DashboardMain;
