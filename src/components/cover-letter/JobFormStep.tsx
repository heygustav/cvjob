
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
    <div className="p-4 sm:p-6 md:p-8">
      {isSavedJob && (
        <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
          <InfoIcon className="h-4 w-4 text-amber-800" />
          <AlertTitle className="text-amber-800 font-medium">Bemærk</AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            Denne funktion understøtter i øjeblikket kun generering af ansøgninger for nye jobannoncer. 
            Hvis du vil generere en ansøgning til dette job, skal du kopiere jobdetaljerne og starte en ny.
          </AlertDescription>
        </Alert>
      )}
      
      <JobPostingForm
        onSubmit={onSubmit}
        initialData={selectedJob || undefined}
        isLoading={isGenerating}
      />
      
      {isGenerating && (
        <div className="mt-8 border-t border-gray-100 pt-6">
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
