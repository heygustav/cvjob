
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import JobPostingForm from "../components/JobPostingForm";
import CoverLetterPreview from "../components/CoverLetterPreview";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { GenerationStatus } from "../components/GenerationStatus";
import { useAuth } from "@/components/AuthProvider";
import { useCoverLetterGeneration } from "@/hooks/useCoverLetterGeneration";

const CoverLetterGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const letterId = searchParams.get("letterId");
  const { user } = useAuth();

  const {
    step,
    isGenerating,
    isLoading,
    selectedJob,
    generatedLetter,
    setStep,
    fetchJob,
    fetchLetter,
    handleJobFormSubmit,
    handleEditLetter,
    handleSaveLetter,
  } = useCoverLetterGeneration(user);

  useEffect(() => {
    if (user) {
      if (jobId) {
        fetchJob(jobId);
      } else if (letterId) {
        fetchLetter(letterId);
      } else {
        setIsLoading(false);
      }
    }
  }, [user, jobId, letterId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              {step === 1 ? "Indtast jobdetaljer" : "Din ansøgning"}
            </h1>
            <p className="mt-1 text-lg text-gray-600">
              {step === 1
                ? "Angiv information om jobbet, du søger"
                : "Gennemgå og rediger din AI-genererede ansøgning"}
            </p>
          </div>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Rediger jobdetaljer
            </button>
          )}
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
          {step === 1 ? (
            <div className="p-6">
              <JobPostingForm
                onSubmit={handleJobFormSubmit}
                initialData={selectedJob || undefined}
                isLoading={isGenerating}
              />
              {isGenerating && <GenerationStatus />}
            </div>
          ) : (
            <div className="p-6">
              {generatedLetter && selectedJob && (
                <CoverLetterPreview
                  content={generatedLetter.content}
                  jobTitle={selectedJob.title}
                  company={selectedJob.company}
                  onEdit={handleEditLetter}
                  onSave={handleSaveLetter}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
