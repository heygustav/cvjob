
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useCoverLetterGeneration } from "@/hooks/useCoverLetterGeneration";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import GeneratorHeader from "@/components/cover-letter/GeneratorHeader";
import GeneratorLoadingState from "@/components/cover-letter/GeneratorLoadingState";
import GeneratorErrorState from "@/components/cover-letter/GeneratorErrorState";
import JobFormStep from "@/components/cover-letter/JobFormStep";
import PreviewStep from "@/components/cover-letter/PreviewStep";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const CoverLetterGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const letterId = searchParams.get("letterId");
  const { session } = useAuth();
  const [loading, setLoading] = React.useState(true);
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
    saveJobAsDraft,
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
        
        // For saved job viewing (no generation support for existing jobs)
        if (jobId) {
          await fetchJob(jobId);
          console.log("Job fetched, any loading state should now be managed by the hook");
        } 
        // For viewing generated letters
        else if (letterId) {
          await fetchLetter(letterId);
          console.log("Letter fetched, any loading state should now be managed by the hook");
        } 
        // Default - for new job submissions
        else {
          console.log("No job or letter ID provided - new submission mode");
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

  // Wrapper for saveJobAsDraft to make it return Promise<void> instead of Promise<string | null>
  const handleSaveJobAsDraft = async (jobData: any) => {
    await saveJobAsDraft(jobData);
  };

  // Render functions
  const renderContent = () => {
    // Show main loading state during initial data fetch
    if (loading) {
      return <LoadingSpinner message="Indlæser data..." progress={20} />;
    }
    
    // Show loading state for generation or other operations
    if (isLoading) {
      return (
        <GeneratorLoadingState 
          isGenerating={isGenerating}
          loadingState={loadingState}
          generationPhase={generationPhase}
          generationProgress={generationProgress}
          resetError={resetError}
        />
      );
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
          <GeneratorHeader step={step} setStep={setStep} />

          {/* Error message section */}
          {generationError && (
            <GeneratorErrorState 
              errorMessage={generationError} 
              resetError={resetError} 
              generationPhase={generationPhase}
            />
          )}

          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 text-left">
            {step === 1 ? (
              <JobFormStep
                selectedJob={selectedJob}
                isGenerating={isGenerating}
                generationPhase={generationPhase}
                generationProgress={generationProgress}
                resetError={resetError}
                onSubmit={handleJobFormSubmit}
                onSave={handleSaveJobAsDraft}
              />
            ) : (
              <>
                {generatedLetter && selectedJob ? (
                  <PreviewStep
                    generatedLetter={generatedLetter}
                    selectedJob={selectedJob}
                    onEdit={handleEditLetter}
                  />
                ) : (
                  <div className="text-left py-10 p-4 sm:p-6">
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
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default CoverLetterGenerator;
