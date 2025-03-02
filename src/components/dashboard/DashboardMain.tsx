
import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardActions from "@/components/dashboard/DashboardActions";
import DashboardContent from "@/components/dashboard/DashboardContent";

interface DashboardMainProps {
  jobPostings: any[];
  coverLetters: any[];
  isDeleting: boolean;
  isRefreshing: boolean;
  onJobDelete: (id: string) => void;
  onLetterDelete: (id: string) => void;
  onRefresh: () => void;
  findJobForLetter: (jobPostingId: string) => any | undefined;
}

const DashboardMain: React.FC<DashboardMainProps> = ({
  jobPostings,
  coverLetters,
  isDeleting,
  isRefreshing,
  onJobDelete,
  onLetterDelete,
  onRefresh,
  findJobForLetter
}) => {
  const [activeTab, setActiveTab] = useState<"letters" | "jobs">("letters");

  const handleTabChange = (tab: "letters" | "jobs") => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 mt-16">
      <DashboardHeader />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Dit dashboard</h2>
        
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
