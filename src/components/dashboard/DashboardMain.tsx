
import React, { useState, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardActions from "@/components/dashboard/DashboardActions";
import TabContent from "@/components/dashboard/tab-content/TabContent";
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

  const handleTabChange = useCallback((tab: "letters" | "jobs" | "companies") => {
    setActiveTab(tab);
  }, []);

  const jobCount = jobPostings.length;
  const letterCount = coverLetters.length;
  const companyCount = companies.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <header className="space-y-4 sm:space-y-6">
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

      <main id="main-content" className="focus:outline-none mt-4 sm:mt-6" tabIndex={-1}>
        <div className="mb-4 sm:mb-6 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0" role="navigation">
          <TabNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="flex justify-start mb-4 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 pb-2">
          <DashboardActions 
            activeTab={activeTab}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        </div>

        <div className="-mx-3 sm:mx-0 px-3 sm:px-0">
          <TabContent 
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
        </div>
      </main>
    </div>
  );
};

export default React.memo(DashboardMain);

