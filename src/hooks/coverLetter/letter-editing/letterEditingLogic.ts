
import { CoverLetter } from "@/lib/types";
import { updateLetterContent } from "@/services/coverLetter/database";

interface EditLetterParams {
  updatedContent: string;
  generatedLetter: CoverLetter | null;
  user: any | null;
  isMountedRef: React.MutableRefObject<boolean>;
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void;
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
  setGenerationProgress: React.Dispatch<React.SetStateAction<any>>;
  fetchWithTimeout: <T>(promise: Promise<T>, timeoutMs?: number) => Promise<T>;
  toastMessages: any;
  toast: any;
}

export async function editLetterLogic({
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
}: EditLetterParams) {
  if (!generatedLetter || !user || !isMountedRef.current) return;

  try {
    safeSetState(setLoadingState, "saving");
    safeSetState(setGenerationProgress, {
      phase: 'letter-save',
      progress: 50,
      message: 'Gemmer ændringer...'
    });
    
    await fetchWithTimeout(updateLetterContent(generatedLetter.id, updatedContent));

    if (!isMountedRef.current) return;
    
    safeSetState(setGeneratedLetter, {
      ...generatedLetter,
      content: updatedContent
    });

    safeSetState(setGenerationProgress, {
      phase: 'letter-save',
      progress: 100,
      message: 'Ændringer gemt!'
    });

    toast(toastMessages.letterUpdated);
  } catch (error) {
    console.error('Error updating letter:', error);
    
    if (!isMountedRef.current) return;
    
    const isNetworkError = !navigator.onLine || 
      (error instanceof Error && error.message.includes('forbindelse'));
    
    toast({
      title: "Fejl ved opdatering",
      description: isNetworkError 
        ? "Kontroller din internetforbindelse og prøv igen."
        : "Der opstod en fejl under opdatering af ansøgningen.",
      variant: "destructive",
    });
  } finally {
    if (isMountedRef.current) {
      safeSetState(setLoadingState, "idle");
    }
  }
}
