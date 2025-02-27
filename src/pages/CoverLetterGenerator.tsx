
import React, { useEffect, useState, useRef } from "react";
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const initStarted = useRef(false);
  
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
    handleSaveLetter,
    resetError,
  } = useCoverLetterGeneration(user);

  // One-time initialization
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      if (initStarted.current) return;
      initStarted.current = true;
      
      try {
        if (!user) {
          console.log("No user found, can't initialize");
          if (isMounted) setLoading(false);
          return;
        }
        
        console.log("Starting initialization with params:", { jobId, letterId });
        
        if (jobId) {
          await fetchJob(jobId);
          console.log("Job fetched, any loading state should now be managed by the hook");
        } else if (letterId) {
          await fetchLetter(letterId);
          console.log("Letter fetched, any loading state should now be managed by the hook");
        } else {
          console.log("No job or letter ID provided");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        if (isMounted) {
          toast({
            title: "Fejl ved indlæsning",
            description: "Der opstod en fejl under indlæsning af data.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log("Initialization complete, loading set to false");
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
      console.log("Generator component unmounting");
    };
  }, [fetchJob, fetchLetter, jobId, letterId, toast, user]);

  // Show main loading state during initial data fetch
  if (loading) {
    return <LoadingSpinner message="Indlæser data..." progress={20} />;
  }
  
  // Show loading state for generation or other operations
  if (isLoading) {
    const message = isGenerating 
      ? (generationPhase === 'user-fetch' ? "Henter brugerdata..." :
         generationPhase === 'job-save' ? "Gemmer jobdetaljer..." :
         generationPhase === 'generation' ? (generationProgress?.message || "Genererer ansøgning...") :
         generationPhase === 'letter-save' ? "Gemmer ansøgning..." : "Arbejder...")
      : (loadingState === "saving" ? "Gemmer ændringer..." : "Indlæser data...");
    
    const progress = generationProgress?.progress || 30;
    
    return <LoadingSpinner message={message} progress={progress} />;
  }

  console.log("Rendering generator content:", {
    step,
    generatedLetter: generatedLetter?.id,
    selectedJob: selectedJob?.id,
    generationError
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
