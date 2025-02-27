
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobPostingForm from "../components/JobPostingForm";
import CoverLetterPreview from "../components/CoverLetterPreview";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { GenerationStatus } from "../components/GenerationStatus";
import ErrorDisplay from "../components/ErrorDisplay";
import { useAuth } from "@/components/AuthProvider";
import { useCoverLetterGeneration } from "@/hooks/useCoverLetterGeneration";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const CoverLetterGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const letterId = searchParams.get("letterId");
  const { session } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  
  // Convert Supabase user to our app's User type
  const user: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email || "",
    name: session.user.user_metadata?.name || "", // Get name from metadata if available
    profileComplete: false // Default value
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
    handleSaveLetter,
    resetError,
  } = useCoverLetterGeneration(user);

  // Use a ref to prevent multiple initialization attempts
  const initRef = React.useRef(false);

  useEffect(() => {
    // Guard against running the effect multiple times
    if (initRef.current) return;
    
    const initializeGenerator = async () => {
      try {
        if (!user) {
          console.log("No user found, skipping initialization");
          setIsInitialized(true);
          return;
        }
        
        if (jobId) {
          console.log("Initializing generator with jobId:", jobId);
          await fetchJob(jobId);
        } else if (letterId) {
          console.log("Initializing generator with letterId:", letterId);
          await fetchLetter(letterId);
        }
        
        // Mark as initialized regardless of outcome
        console.log("Generator initialization complete");
      } catch (error) {
        console.error("Error initializing generator:", error);
        toast({
          title: "Fejl ved indlæsning",
          description: "Der opstod en fejl under indlæsning af data.",
          variant: "destructive",
        });
      } finally {
        setIsInitialized(true);
        // Set the ref to true to prevent re-runs
        initRef.current = true;
      }
    };

    initializeGenerator();
    
    // Cleanup: nothing specific needed here
    return () => {
      console.log("Generator component unmounting");
    };
  }, [user, jobId, letterId, fetchJob, fetchLetter, toast]);

  // Determine if we should show the loading spinner
  const showLoadingSpinner = !isInitialized || isLoading;

  // Get appropriate loading message
  const getLoadingMessage = () => {
    if (!isInitialized) return "Indlæser data...";
    
    if (isGenerating && generationProgress?.message) {
      return generationProgress.message;
    }
    
    if (isGenerating) {
      if (generationPhase === 'user-fetch') return "Henter brugerdata...";
      if (generationPhase === 'job-save') return "Gemmer jobdetaljer...";
      if (generationPhase === 'generation') return "Genererer ansøgning...";
      if (generationPhase === 'letter-save') return "Gemmer ansøgning...";
      return "Genererer ansøgning...";
    }
    
    if (loadingState === "saving") return "Gemmer ændringer...";
    if (loadingState === "initializing") return "Indlæser data...";
    
    return "Indlæser jobinformation...";
  };

  // Calculate progress value with fallback
  const getProgressValue = () => {
    if (!isInitialized) return 10; // Initial loading progress
    
    // For generation phase, use the specific progress
    if (isGenerating && generationProgress?.progress) {
      return generationProgress.progress;
    }
    
    // For other loading phases, use a static value
    if (isLoading) return 30;
    
    return 0; // No progress shown when not loading
  };

  // Show loading state when initializing or generating
  if (showLoadingSpinner) {
    const progressValue = getProgressValue();
    console.log("Showing loading spinner with progress:", progressValue);
    return <LoadingSpinner message={getLoadingMessage()} progress={progressValue} />;
  }

  console.log("Rendering generator content:", { 
    step, 
    generatedLetter: generatedLetter?.id, 
    selectedJob: selectedJob?.id, 
    generationError,
    phase: generationPhase,
    progress: generationProgress
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900">
              {step === 1 ? "Indtast jobdetaljer" : "Din ansøgning"}
            </h1>
            <p className="mt-1 text-sm sm:text-lg text-gray-600">
              {step === 1
                ? "Angiv information om jobbet, du søger"
                : "Gennemgå og rediger din AI-genererede ansøgning"}
            </p>
          </div>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black w-full sm:w-auto"
            >
              Rediger jobdetaljer
            </button>
          )}
        </div>

        {/* Error message section */}
        {generationError && (
          <ErrorDisplay
            title="Der opstod en fejl"
            message={generationError}
            onRetry={resetError}
            phase={generationPhase as any}
          />
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
          {step === 1 ? (
            <div className="p-4 sm:p-6">
              <JobPostingForm
                onSubmit={handleJobFormSubmit}
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
          ) : (
            <div className="p-4 sm:p-6">
              {generatedLetter && selectedJob ? (
                <CoverLetterPreview
                  content={generatedLetter.content}
                  jobTitle={selectedJob.title}
                  company={selectedJob.company}
                  onEdit={handleEditLetter}
                  onSave={handleSaveLetter}
                />
              ) : (
                <div className="text-left py-10">
                  <p className="text-gray-500">
                    Der opstod en fejl ved indlæsning af ansøgningen. Prøv igen.
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Gå tilbage
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
