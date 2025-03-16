
import React, { Suspense, lazy } from "react";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationProgress } from "@/hooks/coverLetter/types";

// Lazy loaded components
const JobFormStep = lazy(() => import("../JobFormStep"));
const LetterPreviewStep = lazy(() => import("../LetterPreviewStep"));

// Loading fallback
const ComponentLoader = () => (
  <div className="w-full py-16 flex justify-center items-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

interface GeneratorStepRendererProps {
  step: 1 | 2;
  jobData?: JobFormData;
  setJobData?: (data: JobFormData) => void;
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
  return (
    <Suspense fallback={<ComponentLoader />}>
      {step === 1 && (
        <JobFormStep
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
      )}

      {step === 2 && generatedLetter && (
        <LetterPreviewStep 
          generatedLetter={generatedLetter} 
          onEdit={handleEditContent}
        />
      )}
    </Suspense>
  );
};
