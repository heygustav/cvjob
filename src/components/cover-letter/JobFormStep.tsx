
import React from "react";
import { User, JobPosting } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import JobPostingForm from "../JobPostingForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { GenerationProgress } from "@/hooks/coverLetter/types";
import GenerationProgressIndicator from "../GenerationProgressIndicator";

export interface JobFormStepProps {
  jobData?: JobFormData;
  setJobData?: (data: JobFormData) => void;
  onSubmit: (jobData: JobFormData) => Promise<void>;
  isLoading: boolean;
  user?: User | null;
  initialJobId?: string;
  selectedJob?: JobPosting | null;
  isGenerating?: boolean;
  generationPhase?: string | null;
  generationProgress?: GenerationProgress;
  resetError?: () => void;
  onSave?: (jobData: JobFormData) => Promise<void>;
}

const JobFormStep: React.FC<JobFormStepProps> = ({
  jobData,
  setJobData,
  onSubmit,
  isLoading,
  user,
  initialJobId,
  selectedJob = null,
  isGenerating = false,
  generationPhase = null,
  generationProgress,
  resetError = () => {},
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
        isLoading={isLoading}
      />
      
      {isGenerating && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <GenerationProgressIndicator 
            loading={isGenerating}
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
