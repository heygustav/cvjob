
import React from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { Briefcase } from "lucide-react";
import LetterListComponent from "@/components/dashboard/LetterListComponent";
import JobListComponent from "@/components/dashboard/JobListComponent";
import EmptyLetterState from "./letter-components/EmptyLetterState";

interface DashboardContentProps {
  activeTab: "letters" | "jobs";
  onTabChange: (tab: "letters" | "jobs") => void;
  jobPostings: JobPosting[];
  coverLetters: CoverLetter[];
  isDeleting: boolean;
  onJobDelete: (id: string) => void;
  onLetterDelete: (id: string) => void;
  findJobForLetter: (jobPostingId: string) => JobPosting | undefined;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  onTabChange,
  jobPostings,
  coverLetters,
  isDeleting,
  onJobDelete,
  onLetterDelete,
  findJobForLetter,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border-0">
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
        ) : (
          jobPostings.length > 0 && (
            <div className="text-left mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Dine jobopslag</h2>
              <p className="text-sm text-gray-500">
                Se og administrer dine gemte jobopslag.
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
        ) : (
          jobPostings.length > 0 ? (
            <JobListComponent
              jobPostings={jobPostings}
              isDeleting={isDeleting}
              onJobDelete={onJobDelete}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="rounded-full bg-gray-100 p-5 mb-5">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ingen jobopslag endnu
              </h3>
              <p className="text-gray-500 max-w-md mb-6">
                Du har ikke tilføjet nogen jobopslag endnu. Tilføj dit første jobopslag for at komme i gang.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
