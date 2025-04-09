
import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardActions from "@/components/dashboard/DashboardActions";
import DashboardContent from "@/components/dashboard/DashboardContent";
import TabNav from "@/components/dashboard/TabNav";
import { SubscriptionStatus } from "@/services/subscription/types";
import { Company } from "@/lib/types";

interface DashboardMainProps {
  jobPostings: any[];
  coverLetters: any[];
  companies: Company[];
  isDeleting: boolean;
  isRefreshing: boolean;
  onJobDelete: (id: string) => void;
  onLetterDelete: (id: string) => void;
  onCompanyDelete: (id: string) => void;
  onRefresh: () => void;
  findJobForLetter: (jobPostingId: string) => any | undefined;
  subscriptionStatus?: SubscriptionStatus;
}

const DashboardMain: React.FC<DashboardMainProps> = ({
  jobPostings,
  coverLetters,
  companies,
  isDeleting,
  isRefreshing,
  onJobDelete,
  onLetterDelete,
  onCompanyDelete,
  onRefresh,
  findJobForLetter,
  subscriptionStatus
}) => {
  const [activeTab, setActiveTab] = useState<"letters" | "jobs" | "companies">("letters");

  const handleTabChange = (tab: "letters" | "jobs" | "companies") => {
    setActiveTab(tab);
  };

  const jobCount = jobPostings.length;
  const letterCount = coverLetters.length;
  const companyCount = companies.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <header>
        <DashboardHeader 
          jobCount={jobCount}
          letterCount={letterCount}
          companyCount={companyCount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoading={isRefreshing}
          subscriptionStatus={subscriptionStatus}
        />
      </header>

      <main id="main-content">
        <div className="mb-6" role="navigation">
          <TabNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="flex justify-start mb-4">
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
          companies={companies}
          isDeleting={isDeleting}
          onJobDelete={onJobDelete}
          onLetterDelete={onLetterDelete}
          onCompanyDelete={onCompanyDelete}
          findJobForLetter={findJobForLetter}
        />
      </main>
    </div>
  );
};

export default DashboardMain;
