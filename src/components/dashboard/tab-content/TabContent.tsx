
import React from "react";
import { Company, JobPosting } from "@/lib/types";
import { FileIcon } from "lucide-react";
import LetterListComponent from "@/components/dashboard/LetterListComponent";
import JobListComponent from "@/components/dashboard/JobListComponent";
import CompanyListComponent from "@/components/dashboard/CompanyListComponent";
import EmptyLetterState from "../letter-components/EmptyLetterState";
import { Building, Briefcase } from "lucide-react";

interface TabContentProps {
  activeTab: "letters" | "jobs" | "companies";
  onTabChange: (tab: "letters" | "jobs" | "companies") => void;
  jobPostings: JobPosting[];
  coverLetters: any[];
  companies: Company[];
  isDeleting: boolean;
  onJobDelete: (id: string) => void;
  onLetterDelete: (id: string) => void;
  onCompanyDelete: (id: string) => void;
  findJobForLetter: (jobPostingId: string) => JobPosting | undefined;
}

const TabContent: React.FC<TabContentProps> = ({
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
  // Memoize these values
  const hasLetters = coverLetters.length > 0;
  const hasJobs = jobPostings.length > 0;
  const hasCompanies = companies.length > 0;

  return (
    <div 
      className="bg-white shadow-sm rounded-lg overflow-hidden border-0"
      role="tabpanel"
      id={`panel-${activeTab}`}
      aria-labelledby={`tab-${activeTab}`}
    >
      <div className="p-6">
        {activeTab === "letters" ? (
          hasLetters ? (
            <div className="text-left mb-4">
              <h2 className="text-lg font-medium text-gray-900">Dine ansøgninger</h2>
              <p className="text-sm text-gray-500">
                Se og administrer dine gemte ansøgninger.
              </p>
            </div>
          ) : (
            <EmptyLetterState />
          )
        ) : activeTab === "jobs" ? (
          hasJobs && (
            <div className="text-left mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Dine jobopslag</h2>
              <p className="text-sm text-gray-500">
                Se og administrer dine gemte jobopslag.
              </p>
            </div>
          )
        ) : (
          hasCompanies && (
            <div className="text-left mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Dine virksomheder</h2>
              <p className="text-sm text-gray-500">
                Se og administrer dine gemte virksomheder.
              </p>
            </div>
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
            <div className="flex flex-col items-start py-12 px-4 text-left" aria-live="polite">
              <div className="rounded-full bg-gray-100 p-5 mb-5">
                <Briefcase className="h-8 w-8 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ingen jobopslag endnu
              </h3>
              <p className="text-gray-500 max-w-md mb-6">
                Du har ikke tilføjet nogen jobopslag endnu. Tilføj dit første jobopslag for at komme i gang.
              </p>
            </div>
          )
        ) : (
          hasCompanies ? (
            <CompanyListComponent
              companies={companies}
              isDeleting={isDeleting}
              onCompanyDelete={onCompanyDelete}
            />
          ) : (
            <div className="flex flex-col items-start py-12 px-4 text-left" aria-live="polite">
              <div className="rounded-full bg-gray-100 p-5 mb-5">
                <Building className="h-8 w-8 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ingen virksomheder endnu
              </h3>
              <p className="text-gray-500 max-w-md mb-6">
                Du har ikke tilføjet nogen virksomheder endnu. Tilføj din første virksomhed for at komme i gang.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TabContent;
