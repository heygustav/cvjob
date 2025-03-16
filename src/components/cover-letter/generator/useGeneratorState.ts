
import { useState } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter, JobPosting } from "@/lib/types";
import { GenerationProgress } from "@/hooks/coverLetter/types";

export const useGeneratorState = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [jobData, setJobData] = useState<JobFormData>({
    title: "",
    company: "",
    description: "",
  });
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState("idle");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    phase: 'letter-save',
    progress: 0,
    message: 'Loading letter...'
  });
  
  // Reset any error
  const resetError = () => {
    setError(null);
    setIsGenerating(false);
    setLoadingState("idle");
  };

  return {
    step,
    setStep,
    jobData,
    setJobData,
    generatedLetter,
    setGeneratedLetter,
    isLoading,
    setIsLoading,
    error,
    setError,
    isGenerating,
    setIsGenerating,
    generationPhase,
    setGenerationPhase,
    loadingState,
    setLoadingState,
    selectedJob,
    setSelectedJob,
    generationProgress,
    setGenerationProgress,
    resetError,
  };
};
