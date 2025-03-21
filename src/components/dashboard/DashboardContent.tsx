import React from "react";
import { JobPosting, CoverLetter, Company } from "@/lib/types";
import { Briefcase, Building } from "lucide-react";
import LetterListComponent from "@/components/dashboard/LetterListComponent";
import JobListComponent from "@/components/dashboard/JobListComponent";
import CompanyListComponent from "@/components/dashboard/CompanyListComponent";
import EmptyLetterState from "./letter-components/EmptyLetterState";

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

const DashboardContent: React.FC<DashboardContentProps> = ({
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
  return (
    <div 
      className="bg-white shadow-sm rounded-lg overflow-hidden border-0"
      role="tabpanel"
      id={
        activeTab === "letters" 
          ? "panel-letters" 
          : activeTab === "jobs" 
            ? "panel-jobs" 
            : "panel-companies"
      }
      aria-labelledby={
        activeTab === "letters" 
          ? "tab-letters" 
          : activeTab === "jobs" 
            ? "tab-jobs" 
            : "tab-companies"
      }
    >
      <div className="p-6">
        {activeTab === "letters" ? (
          coverLetters.length > 0 ? (
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
          jobPostings.length > 0 && (
            <div className="text-left mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Dine jobopslag</h2>
              <p className="text-sm text-gray-500">
                Se og administrer dine gemte jobopslag.
              </p>
            </div>
          )
        ) : (
          companies.length > 0 && (
            <div className="text-left mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Dine virksomheder</h2>
              <p className="text-sm text-gray-500">
                Se og administrer dine gemte virksomheder.
              </p>
            </div>
          )
        )}
        
        {activeTab === "letters" ? (
          coverLetters.length > 0 && (
            <LetterListComponent 
              coverLetters={coverLetters}
              jobPostings={jobPostings}
              isDeleting={isDeleting}
              onLetterDelete={onLetterDelete}
              findJobForLetter={findJobForLetter}
            />
          )
        ) : activeTab === "jobs" ? (
          jobPostings.length > 0 ? (
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
          companies.length > 0 ? (
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

export default DashboardContent;
