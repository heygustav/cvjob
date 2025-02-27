
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobPostingForm from "../components/JobPostingForm";
import CoverLetterPreview from "../components/CoverLetterPreview";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { GenerationStatus } from "../components/GenerationStatus";
import { useAuth } from "@/components/AuthProvider";
import { useCoverLetterGeneration } from "@/hooks/useCoverLetterGeneration";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, RefreshCcw } from "lucide-react";

const CoverLetterGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const letterId = searchParams.get("letterId");
  const { session } = useAuth();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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

  useEffect(() => {
    const initializeGenerator = async () => {
      try {
        if (user) {
          if (jobId) {
            console.log("Initializing generator with jobId:", jobId);
            await fetchJob(jobId);
          } else if (letterId) {
            console.log("Initializing generator with letterId:", letterId);
            await fetchLetter(letterId);
          }
        }
      } catch (error) {
        console.error("Error initializing generator:", error);
        toast({
          title: "Fejl ved indlæsning",
          description: "Der opstod en fejl under indlæsning af data.",
          variant: "destructive",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeGenerator();
  }, [user, jobId, letterId, fetchJob, fetchLetter, toast]);

  // Determine loading state - either initial loading or generation in progress
  const showLoadingSpinner = isInitialLoading || isLoading;

  // Get appropriate loading message
  const getLoadingMessage = () => {
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

  // Show loading state when initializing or generating
  if (showLoadingSpinner) {
    return <LoadingSpinner message={getLoadingMessage()} />;
  }

  console.log("Rendering state:", { 
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
          <div className="mb-6 p-4 sm:p-5 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Der opstod en fejl under generering af ansøgningen
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{generationError}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={resetError}
                    className="inline-flex items-center px-3 py-1.5 border border-red-600 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <RefreshCcw className="mr-1.5 h-3 w-3" />
                    Prøv igen
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                  progress={generationProgress.progress}
                  message={generationProgress.message}
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
                <div className="text-center py-10">
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
