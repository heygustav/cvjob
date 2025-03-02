
import React from "react";
import JobPostingForm from "../JobPostingForm";
import { GenerationStatus } from "../GenerationStatus";
import { JobPosting } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
  onSave?: (jobData: JobFormData) => Promise<void>;
}

const JobFormStep: React.FC<JobFormStepProps> = ({
  selectedJob,
  isGenerating,
  generationPhase,
  generationProgress,
  resetError,
  onSubmit,
  onSave
}) => {
  // Show notice if this is a saved job (currently not supporting generation for saved jobs)
  const isSavedJob = selectedJob !== null;

  return (
    <div className="p-4 sm:p-6 md:p-8 text-left">
      {isSavedJob && (
        <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200 text-left">
          <InfoIcon className="h-4 w-4 text-blue-700" />
          <AlertTitle className="text-blue-800">Bemærk</AlertTitle>
          <AlertDescription className="text-sm text-blue-700">
            Denne funktion understøtter i øjeblikket kun generering af ansøgninger for nye jobannoncer. 
            Hvis du vil generere en ansøgning til dette job, skal du kopiere jobdetaljerne og starte en ny.
          </AlertDescription>
        </Alert>
      )}
      
      <JobPostingForm
        onSubmit={onSubmit}
        onSave={onSave}
        initialData={selectedJob || undefined}
        isLoading={isGenerating}
      />
      
      {isGenerating && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <GenerationStatus 
            phase={generationPhase || 'generation'} 
            progress={generationProgress?.progress || 0}
            message={generationProgress?.message}
            onRetry={resetError}
          />
        </div>
      )}
    </div>
  );
};

export default JobFormStep;
