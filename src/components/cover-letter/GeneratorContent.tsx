
import React from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import GeneratorHeader from "@/components/cover-letter/GeneratorHeader";
import GeneratorLoadingState from "@/components/cover-letter/GeneratorLoadingState";
import GeneratorErrorState from "@/components/cover-letter/GeneratorErrorState";
import JobFormStep from "@/components/cover-letter/JobFormStep";
import PreviewStep from "@/components/cover-letter/PreviewStep";
import { JobFormData } from "@/services/coverLetter/types";

interface GeneratorContentProps {
  initialLoading: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  loadingState: string;
  step: 1 | 2;
  generationPhase: string | null;
  generationProgress: any;
  generationError: string | null;
  selectedJob: JobPosting | null;
  generatedLetter: CoverLetter | null;
  setStep: (step: 1 | 2) => void;
  resetError: () => void;
  handleJobFormSubmit: (jobData: JobFormData) => Promise<void>;
  handleEditLetter: (content: string) => Promise<void>;
  handleSaveJobAsDraft: (jobData: JobFormData) => Promise<void>;
}

const GeneratorContent: React.FC<GeneratorContentProps> = ({
  initialLoading,
  isLoading,
  isGenerating,
  loadingState,
  step,
  generationPhase,
  generationProgress,
  generationError,
  selectedJob,
  generatedLetter,
  setStep,
  resetError,
  handleJobFormSubmit,
  handleEditLetter,
  handleSaveJobAsDraft
}) => {
  // Show main loading state during initial data fetch
  if (initialLoading) {
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

export default GeneratorContent;
