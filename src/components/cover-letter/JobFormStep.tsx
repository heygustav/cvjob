
import React from "react";
import JobPostingForm from "../JobPostingForm";
import { GenerationStatus } from "../GenerationStatus";
import { JobPosting } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";

interface JobFormStepProps {
  selectedJob: JobPosting | null;
  isGenerating: boolean;
  generationPhase: string | null;
  generationProgress?: {
    progress?: number;
    message?: string;
  };
  resetError: () => void;
  onSubmit: (jobData: JobFormData) => Promise<void>;
}

const JobFormStep: React.FC<JobFormStepProps> = ({
  selectedJob,
  isGenerating,
  generationPhase,
  generationProgress,
  resetError,
  onSubmit
}) => {
  // Show notice if this is a saved job (currently not supporting generation for saved jobs)
  const isSavedJob = selectedJob !== null;

  return (
    <div className="p-4 sm:p-6">
      {isSavedJob && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h3 className="text-amber-800 font-medium">Bemærk</h3>
          <p className="text-amber-700 text-sm">
            Denne funktion understøtter i øjeblikket kun generering af ansøgninger for nye jobannoncer. 
            Hvis du vil generere en ansøgning til dette job, skal du kopiere jobdetaljerne og starte en ny.
          </p>
        </div>
      )}
      
      <JobPostingForm
        onSubmit={onSubmit}
        initialData={selectedJob || undefined}
        isLoading={isGenerating}
      />
      
      {isGenerating && (
        <GenerationStatus 
          phase={generationPhase || 'generation'} 
          progress={generationProgress?.progress || 0}
          message={generationProgress?.message}
          onRetry={resetError}
        />
      )}
    </div>
  );
};

export default JobFormStep;
