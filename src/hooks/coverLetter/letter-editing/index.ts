
import { useCallback } from "react";
import { CoverLetter, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "../useToastMessages";
import { useNetworkUtils } from "../useNetworkUtils";
import { editLetterLogic } from "./letterEditingLogic";

export * from "./letterEditingLogic";

export const useLetterEditing = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<any>>,
  generatedLetter: CoverLetter | null
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();
  const navigate = useNavigate();
  const { fetchWithTimeout } = useNetworkUtils();

  const handleEditLetter = useCallback(async (updatedContent: string) => {
    await editLetterLogic({
      updatedContent,
      generatedLetter,
      user,
      isMountedRef,
      safeSetState,
      setGeneratedLetter,
      setLoadingState,
      setGenerationProgress,
      fetchWithTimeout,
      toastMessages,
      toast
    });
  }, [generatedLetter, toast, toastMessages, user, fetchWithTimeout, isMountedRef, safeSetState, setGeneratedLetter, setGenerationProgress, setLoadingState]);

  const handleSaveLetter = useCallback(() => {
    navigate("/dashboard");
    toast(toastMessages.letterSaved);
  }, [navigate, toast, toastMessages]);

  const resetError = useCallback(() => {
    if (isMountedRef.current) {
      safeSetState(setGeneratedLetter, null);
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 0,
        message: 'Forbereder...'
      });
    }
  }, [isMountedRef, safeSetState, setGeneratedLetter, setGenerationProgress]);

  return {
    handleEditLetter,
    handleSaveLetter,
    resetError
  };
};
