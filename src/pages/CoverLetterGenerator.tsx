
import React, { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useCoverLetterGeneration } from "@/hooks/useCoverLetterGeneration";
import { User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { useGeneratorInitialization } from "@/hooks/coverLetter/useGeneratorInitialization";
import { GeneratorContent } from "@/components/cover-letter/GeneratorContent";

const CoverLetterGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const letterId = searchParams.get("letterId");
  const stepParam = searchParams.get("step");
  const isDirect = searchParams.get("direct") === "true";
  const { session, isAuthenticated, user: authUser } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);
  const initStarted = useRef(false);
  const isMountedRef = useRef(true);
  
  // Convert Supabase user to our app's User type
  const user: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email || "",
    name: session.user.user_metadata?.name || "",
    profileComplete: false
  } : null;

  const {
    step,
    isGenerating,
    isLoading,
    loadingState,
    generationPhase,
    generationProgress,
    selectedJob,
    generatedLetter,
    generationError,
    setStep,
    fetchJob,
    fetchLetter,
    handleJobFormSubmit,
    handleEditLetter,
    saveJobAsDraft,
    resetError,
  } = useCoverLetterGeneration(user);

  // Initialize the generator
  useGeneratorInitialization({
    isAuthenticated,
    jobId,
    letterId,
    stepParam,
    isDirect,
    user,
    authUser,
    initStarted,
    isMountedRef,
    setInitialLoading,
    setStep,
    fetchJob,
    fetchLetter
  });

  // Wrapper for saveJobAsDraft to make it return Promise<void> instead of Promise<string | null>
  const handleSaveJobAsDraft = async (jobData: JobFormData) => {
    await saveJobAsDraft(jobData);
  };

  if (initialLoading) {
    return <LoadingSpinner message="Forbereder generator..." />;
  }

  return (
    <GeneratorContent 
      existingLetterId={letterId || undefined}
      step={step}
      isGenerating={isGenerating}
      isLoading={isLoading}
      loadingState={loadingState}
      generationPhase={generationPhase}
      generationProgress={generationProgress}
      selectedJob={selectedJob}
      generatedLetter={generatedLetter}
      generationError={generationError}
      setStep={setStep}
      handleJobFormSubmit={handleJobFormSubmit}
      handleEditLetter={handleEditLetter}
      handleSaveJobAsDraft={handleSaveJobAsDraft}
      resetError={resetError}
    />
  );
};

// Import at the top of the file
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default CoverLetterGenerator;
