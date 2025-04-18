
/**
 * Main hook for cover letter generation functionality
 * This is the primary entry point for consuming the letter generation functionality
 * It combines business logic with UI state but keeps them clearly separated
 */

import { useCallback, useRef, useEffect } from "react";
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { useCoverLetterLogic } from "./logic/useCoverLetterLogic";
import { useCoverLetterState } from "./state/useCoverLetterState";

/**
 * Main hook for cover letter generation
 */
export const useCoverLetterGeneration = (user: User | null) => {
  // References for managing component lifecycle
  const isMountedRef = useRef(true);
  const initStarted = useRef(false);
  
  // Get business logic and UI state from separate hooks
  const logic = useCoverLetterLogic(user);
  const state = useCoverLetterState();
  
  // Extract destructured state for easier use
  const {
    step,
    selectedJob,
    generatedLetter,
    loadingState,
    generationError,
    generationPhase,
    generationProgress,
    isLoading,
    isGenerating,
    
    setStep,
    setSelectedJob,
    setGeneratedLetter,
    setLoadingState,
    resetError,
    updateProgress,
    startJobSubmission,
    completeJobSubmission,
    handleGenerationError
  } = state;
  
  // Ensure we don't update state after component unmounts
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Safe state setter to prevent updates after unmount
  const safeSetState = useCallback(<T>(
    stateSetter: React.Dispatch<React.SetStateAction<T>>, 
    value: T
  ) => {
    if (isMountedRef.current) {
      stateSetter(value);
    }
  }, []);
  
  // Fetch job by ID
  const fetchJob = useCallback(async (jobId: string) => {
    if (!user || !isMountedRef.current) return null;
    
    try {
      safeSetState(setLoadingState, "initializing");
      
      const { job } = await logic.fetchCoverLetter(jobId, updateProgress) || {};
      
      if (job && isMountedRef.current) {
        safeSetState(setSelectedJob, job);
      }
      
      safeSetState(setLoadingState, "idle");
      return job || null;
    } catch (error) {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
        handleGenerationError(error instanceof Error ? error : new Error('Unknown error'));
      }
      return null;
    }
  }, [user, logic, safeSetState, setLoadingState, setSelectedJob, updateProgress, handleGenerationError]);
  
  // Fetch letter by ID
  const fetchLetter = useCallback(async (letterId: string) => {
    if (!user || !isMountedRef.current) return null;
    
    try {
      safeSetState(setLoadingState, "initializing");
      
      const result = await logic.fetchCoverLetter(letterId, updateProgress);
      
      if (result?.letter && isMountedRef.current) {
        safeSetState(setGeneratedLetter, result.letter);
        
        if (result.job) {
          safeSetState(setSelectedJob, result.job);
        }
        
        safeSetState(setStep, 2);
      }
      
      safeSetState(setLoadingState, "idle");
      return result?.letter || null;
    } catch (error) {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
        handleGenerationError(error instanceof Error ? error : new Error('Unknown error'));
      }
      return null;
    }
  }, [user, logic, safeSetState, setLoadingState, setGeneratedLetter, setSelectedJob, setStep, updateProgress, handleGenerationError]);
  
  // Handle job form submission for letter generation
  const handleJobFormSubmit = useCallback(async (jobData: JobFormData) => {
    if (!user || !isMountedRef.current) return;
    
    try {
      startJobSubmission(jobData);
      
      const result = await logic.generateCoverLetter(jobData, updateProgress);
      
      if (result && isMountedRef.current) {
        completeJobSubmission(result.job, result.letter);
      }
    } catch (error) {
      if (isMountedRef.current) {
        handleGenerationError(error instanceof Error ? error : new Error('Unknown error'));
      }
    }
  }, [user, logic, startJobSubmission, updateProgress, completeJobSubmission, handleGenerationError]);
  
  // Handle letter content editing
  const handleEditLetter = useCallback(async (content: string) => {
    if (!user || !generatedLetter || !isMountedRef.current) return;
    
    try {
      safeSetState(setLoadingState, "saving");
      
      const updatedLetter = await logic.editCoverLetter(
        generatedLetter.id, 
        content,
        updateProgress
      );
      
      if (updatedLetter && isMountedRef.current) {
        safeSetState(setGeneratedLetter, updatedLetter);
      }
      
      safeSetState(setLoadingState, "idle");
    } catch (error) {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
        handleGenerationError(error instanceof Error ? error : new Error('Unknown error'));
      }
    }
  }, [user, generatedLetter, logic, safeSetState, setLoadingState, setGeneratedLetter, updateProgress, handleGenerationError]);
  
  // Save job as draft
  const saveJobAsDraft = useCallback(async (jobData: JobFormData) => {
    if (!user || !isMountedRef.current) return null;
    
    try {
      safeSetState(setLoadingState, "saving");
      
      const jobId = await logic.saveJobAsDraft(jobData, updateProgress);
      
      safeSetState(setLoadingState, "idle");
      return jobId;
    } catch (error) {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
        handleGenerationError(error instanceof Error ? error : new Error('Unknown error'));
      }
      return null;
    }
  }, [user, logic, safeSetState, setLoadingState, updateProgress, handleGenerationError]);
  
  return {
    // State
    step,
    isGenerating,
    isLoading,
    loadingState,
    generationPhase,
    generationProgress,
    selectedJob,
    generatedLetter,
    generationError,
    
    // Actions
    setStep,
    fetchJob,
    fetchLetter,
    handleJobFormSubmit,
    handleEditLetter,
    saveJobAsDraft,
    resetError,
  };
};
