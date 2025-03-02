
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
  // Check if this is a saved job that has empty required fields
  const isSavedEmptyJob = selectedJob !== null && 
    (!selectedJob.title || !selectedJob.company || !selectedJob.description);

  return (
    <div className="p-4 sm:p-6 md:p-8 text-left">
      {isSavedEmptyJob ? (
        <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200 text-left">
          <InfoIcon className="h-4 w-4 text-blue-700" />
          <AlertTitle className="text-blue-800">Udfyld jobdetaljer</AlertTitle>
          <AlertDescription className="text-sm text-blue-700">
            Dit gemte job mangler vigtige detaljer. Udfyld venligst jobtitel, virksomhed og beskrivelse for at generere en ansøgning.
          </AlertDescription>
        </Alert>
      ) : selectedJob !== null && selectedJob.title && selectedJob.company && selectedJob.description ? (
        <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200 text-left">
          <InfoIcon className="h-4 w-4 text-blue-700" />
          <AlertTitle className="text-blue-800">Gemt job indlæst</AlertTitle>
          <AlertDescription className="text-sm text-blue-700">
            Du kan redigere detaljerne eller generere en ansøgning direkte ved at klikke på "Generer ansøgning".
          </AlertDescription>
        </Alert>
      ) : null}
      
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
