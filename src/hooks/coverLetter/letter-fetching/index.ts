
import { useCallback } from "react";
import { CoverLetter, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "../useToastMessages";
import { useNetworkUtils } from "../useNetworkUtils";
import { GenerationProgress } from "../types";
import { fetchLetterLogic } from "./fetchLetterLogic";

export * from "./fetchLetterLogic";

export const useLetterFetching = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setSelectedJob: React.Dispatch<React.SetStateAction<any | null>>,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();
  const navigate = useNavigate();
  const { fetchWithTimeout } = useNetworkUtils();

  const fetchLetter = useCallback(async (id: string) => {
    return fetchLetterLogic({
      id,
      isMountedRef,
      safeSetState,
      setSelectedJob,
      setGeneratedLetter,
      setStep,
      setLoadingState,
      setGenerationError,
      setGenerationPhase,
      setGenerationProgress,
      fetchWithTimeout,
      toastMessages,
      toast,
      navigate
    });
  }, [
    isMountedRef, 
    safeSetState, 
    setSelectedJob, 
    setGeneratedLetter, 
    setStep, 
    setLoadingState, 
    setGenerationError, 
    setGenerationPhase, 
    setGenerationProgress, 
    fetchWithTimeout, 
    toastMessages, 
    toast, 
    navigate
  ]);

  return { fetchLetter };
};
