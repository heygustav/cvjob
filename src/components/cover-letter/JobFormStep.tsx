
import React from "react";
import { User, JobPosting } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import JobPostingForm from "../JobPostingForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { GenerationProgress } from "@/hooks/coverLetter/types";
import GenerationProgressIndicator from "../GenerationProgressIndicator";
import DOMPurify from "dompurify";

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

  // Sanitize job details to prevent XSS
  const jobTitle = selectedJob?.title ? DOMPurify.sanitize(selectedJob.title) : "";
  const jobCompany = selectedJob?.company ? DOMPurify.sanitize(selectedJob.company) : "";

  // Safely handle job submission with sanitization
  const handleSafeSubmit = async (formData: JobFormData) => {
    // Sanitize all input data before submission
    const sanitizedData: JobFormData = {
      title: DOMPurify.sanitize(formData.title),
      company: DOMPurify.sanitize(formData.company),
      description: DOMPurify.sanitize(formData.description),
      contact_person: formData.contact_person ? DOMPurify.sanitize(formData.contact_person) : "",
      url: formData.url ? DOMPurify.sanitize(formData.url) : "",
      deadline: formData.deadline ? DOMPurify.sanitize(formData.deadline) : "",
    };
    
    await onSubmit(sanitizedData);
  };
  
  // Safely handle job saving with sanitization
  const handleSafeSave = onSave ? async (formData: JobFormData) => {
    // Sanitize all input data before saving
    const sanitizedData: JobFormData = {
      title: DOMPurify.sanitize(formData.title),
      company: DOMPurify.sanitize(formData.company),
      description: DOMPurify.sanitize(formData.description),
      contact_person: formData.contact_person ? DOMPurify.sanitize(formData.contact_person) : "",
      url: formData.url ? DOMPurify.sanitize(formData.url) : "",
      deadline: formData.deadline ? DOMPurify.sanitize(formData.deadline) : "",
    };
    
    await onSave(sanitizedData);
  } : undefined;

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
        onSubmit={handleSafeSubmit}
        onSave={handleSafeSave}
        initialData={selectedJob || undefined}
        isLoading={isLoading}
      />
      
      {isGenerating && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <GenerationProgressIndicator 
            progress={generationProgress?.progress || 0}
            elapsed={1500}
            phase={generationPhase || 'generation'} 
            message={generationProgress?.message || "Genererer din ansøgning..."}
            onRetry={resetError}
          />
        </div>
      )}
    </div>
  );
};

export default JobFormStep;
