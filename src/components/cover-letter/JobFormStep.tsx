
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
  return (
    <div className="p-4 sm:p-6">
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
