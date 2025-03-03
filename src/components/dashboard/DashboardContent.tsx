
import React from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, FilePlus, Plus } from "lucide-react";
import LetterListComponent from "@/components/dashboard/LetterListComponent";
import JobListComponent from "@/components/dashboard/JobListComponent";

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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
      <div className="p-6">
        {/* Jobs tab header - removed the Add button */}
        {activeTab === "jobs" && jobPostings.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Dine jobopslag</h2>
          </div>
        )}
        
        {activeTab === "letters" ? (
          <LetterListComponent 
            coverLetters={coverLetters}
            jobPostings={jobPostings}
            isDeleting={isDeleting}
            onLetterDelete={onLetterDelete}
            findJobForLetter={findJobForLetter}
          />
        ) : (
          <JobListComponent
            jobPostings={jobPostings}
            isDeleting={isDeleting}
            onJobDelete={onJobDelete}
          />
        )}
        
        {((activeTab === "letters" && coverLetters.length === 0) || 
           (activeTab === "jobs" && jobPostings.length === 0)) && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-gray-100 p-5 mb-5">
              {activeTab === "letters" ? (
                <FilePlus className="h-8 w-8 text-gray-400" />
              ) : (
                <Briefcase className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === "letters" ? "Ingen ansøgninger endnu" : "Ingen jobopslag endnu"}
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              {activeTab === "letters" 
                ? "Du har ikke oprettet nogen ansøgninger endnu. Kom i gang med at skabe din første ansøgning nu."
                : "Du har ikke tilføjet nogen jobopslag endnu. Tilføj dit første jobopslag for at komme i gang."}
            </p>
            <Button asChild>
              <Link to={activeTab === "letters" ? "/ansoegning" : "/job/new"}>
                <Plus className="h-4 w-4 mr-2" />
                {activeTab === "letters" ? "Opret din første ansøgning" : "Tilføj dit første jobopslag"}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
