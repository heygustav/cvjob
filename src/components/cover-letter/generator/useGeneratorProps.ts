
import { useState, useCallback } from "react";
import { JobFormData } from "@/services/coverLetter/types";

export const useGeneratorProps = ({
  propStep, 
  hookStep,
  propIsGenerating, 
  hookIsGenerating,
  propIsLoading, 
  hookIsLoading,
  propLoadingState, 
  hookLoadingState,
  propGenerationPhase, 
  hookGenerationPhase,
  propGenerationProgress, 
  hookGenerationProgress,
  propSelectedJob, 
  hookSelectedJob,
  propGeneratedLetter, 
  hookGeneratedLetter,
  propGenerationError, 
  hookError,
  propSetStep, 
  hookSetStep,
  propResetError, 
  hookResetError,
  propHandleJobFormSubmit, 
  handleGenerateLetter
}) => {
  // Use function props if available, otherwise use hook implementations
  const step = propStep !== undefined ? propStep : hookStep;
  const isGenerating = propIsGenerating !== undefined ? propIsGenerating : hookIsGenerating;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;
  const loadingState = propLoadingState || hookLoadingState;
  const generationPhase = propGenerationPhase !== null ? propGenerationPhase : hookGenerationPhase;
  const selectedJob = propSelectedJob || hookSelectedJob;
  const generatedLetter = propGeneratedLetter || hookGeneratedLetter;
  const error = propGenerationError || hookError;
  const generationProgress = propGenerationProgress || hookGenerationProgress;
  
  // Create wrapper functions that call the provided function if available, otherwise use hook function
  const setStepFn = useCallback((newStep: 1 | 2) => {
    if (propSetStep) {
      propSetStep(newStep);
    } else if (hookSetStep) {
      hookSetStep(newStep);
    }
  }, [propSetStep, hookSetStep]);
  
  const resetErrorFn = useCallback(() => {
    if (propResetError) {
      propResetError();
    } else if (hookResetError) {
      hookResetError();
    }
  }, [propResetError, hookResetError]);
  
  const handleJobFormSubmitFn = useCallback(async (jobData: JobFormData) => {
    if (propHandleJobFormSubmit) {
      await propHandleJobFormSubmit(jobData);
    } else if (handleGenerateLetter) {
      await handleGenerateLetter(jobData);
    }
  }, [propHandleJobFormSubmit, handleGenerateLetter]);
  
  return {
    step,
    isGenerating,
    isLoading,
    loadingState,
    generationPhase,
    selectedJob,
    generatedLetter,
    error,
    generationProgress,
    setStepFn,
    resetErrorFn,
    handleJobFormSubmitFn
  };
};
