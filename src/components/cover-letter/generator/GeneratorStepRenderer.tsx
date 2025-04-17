
import React from "react";
import { CoverLetter, JobPosting, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationProgress } from "@/hooks/coverLetter/types";
import JobInfoStep from "../steps/job-info";
import PreviewStep from "../steps/preview";

interface GeneratorStepRendererProps {
  step: 1 | 2;
  jobData: JobFormData;
  setJobData: React.Dispatch<React.SetStateAction<JobFormData>>;
  generatedLetter: CoverLetter | null;
  isLoading: boolean;
  user: User | null;
  initialJobId?: string;
  selectedJob: JobPosting | null;
  isGenerating: boolean;
  generationPhase: string | null;
  generationProgress: GenerationProgress;
  resetError: () => void;
  handleJobFormSubmit: (jobData: JobFormData) => Promise<void>;
  handleEditContent: (content: string) => Promise<void>;
  handleSaveJobAsDraft?: (jobData: JobFormData) => Promise<void>;
}

export const GeneratorStepRenderer: React.FC<GeneratorStepRendererProps> = ({
  step,
  jobData,
  setJobData,
  generatedLetter,
  isLoading,
  user,
  initialJobId,
  selectedJob,
  isGenerating,
  generationPhase,
  generationProgress,
  resetError,
  handleJobFormSubmit,
  handleEditContent,
  handleSaveJobAsDraft
}) => {
  if (step === 1) {
    return (
      <JobInfoStep
        jobData={jobData}
        setJobData={setJobData}
        onSubmit={handleJobFormSubmit}
        isLoading={isLoading}
        user={user}
        initialJobId={initialJobId}
        selectedJob={selectedJob}
        isGenerating={isGenerating}
        generationPhase={generationPhase}
        generationProgress={generationProgress}
        resetError={resetError}
        onSave={handleSaveJobAsDraft}
      />
    );
  }

  if (generatedLetter) {
    return (
      <PreviewStep
        generatedLetter={generatedLetter}
        onEdit={handleEditContent}
      />
    );
  }

  return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">Ingen ansøgning genereret endnu.</p>
    </div>
  );
};
