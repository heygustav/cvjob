
import React, { memo } from "react";
import { JobPosting, CoverLetter, Company } from "@/lib/types";
import LetterListComponent from "@/components/dashboard/LetterListComponent";
import JobListComponent from "@/components/dashboard/JobListComponent";
import CompanyListComponent from "@/components/dashboard/CompanyListComponent";
import EmptyLetterState from "./letter-components/EmptyLetterState";
import EmptyStateMessage from "./empty-states/EmptyStateMessage";
import SectionHeader from "./sections/SectionHeader";

interface DashboardContentProps {
  activeTab: "letters" | "jobs" | "companies";
  onTabChange: (tab: "letters" | "jobs" | "companies") => void;
  jobPostings: JobPosting[];
  coverLetters: CoverLetter[];
  companies: Company[];
  isDeleting: boolean;
  onJobDelete: (id: string) => void;
  onLetterDelete: (id: string) => void;
  onCompanyDelete: (id: string) => void;
  findJobForLetter: (jobPostingId: string) => JobPosting | undefined;
}

const DashboardContent: React.FC<DashboardContentProps> = memo(({
  activeTab,
  onTabChange,
  jobPostings,
  coverLetters,
  companies,
  isDeleting,
  onJobDelete,
  onLetterDelete,
  onCompanyDelete,
  findJobForLetter,
}) => {
  const hasLetters = coverLetters.length > 0;
  const hasJobs = jobPostings.length > 0;
  const hasCompanies = companies.length > 0;

  const panelId = `panel-${activeTab}`;
  const tabId = `tab-${activeTab}`;

  return (
    <div 
      className="bg-white shadow-sm rounded-lg overflow-hidden border-0"
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
    >
      <div className="p-6">
        {activeTab === "letters" ? (
          hasLetters ? (
            <SectionHeader 
              title="Dine ansøgninger"
              description="Se og administrer dine gemte ansøgninger."
            />
          ) : (
            <EmptyLetterState />
          )
        ) : activeTab === "jobs" ? (
          hasJobs && (
            <SectionHeader 
              title="Dine jobopslag"
              description="Se og administrer dine gemte jobopslag."
            />
          )
        ) : (
          hasCompanies && (
            <SectionHeader 
              title="Dine virksomheder"
              description="Se og administrer dine gemte virksomheder."
            />
          )
        )}
        
        {activeTab === "letters" ? (
          hasLetters && (
            <LetterListComponent 
              coverLetters={coverLetters}
              jobPostings={jobPostings}
              isDeleting={isDeleting}
              onLetterDelete={onLetterDelete}
              findJobForLetter={findJobForLetter}
            />
          )
        ) : activeTab === "jobs" ? (
          hasJobs ? (
            <JobListComponent
              jobPostings={jobPostings}
              isDeleting={isDeleting}
              onJobDelete={onJobDelete}
            />
          ) : (
            <EmptyStateMessage
              type="jobs"
              title="Ingen jobopslag endnu"
              description="Du har ikke tilføjet nogen jobopslag endnu. Tilføj dit første jobopslag for at komme i gang."
            />
          )
        ) : (
          hasCompanies ? (
            <CompanyListComponent
              companies={companies}
              isDeleting={isDeleting}
              onCompanyDelete={onCompanyDelete}
            />
          ) : (
            <EmptyStateMessage
              type="companies"
              title="Ingen virksomheder endnu"
              description="Du har ikke tilføjet nogen virksomheder endnu. Tilføj din første virksomhed for at komme i gang."
            />
          )
        )}
      </div>
    </div>
  );
});

DashboardContent.displayName = 'DashboardContent';

export default DashboardContent;
