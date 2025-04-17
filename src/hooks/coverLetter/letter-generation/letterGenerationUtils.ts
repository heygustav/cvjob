
import { JobFormData } from "@/services/coverLetter/types";
import { User } from "@/lib/types";
import { useNetworkOperations } from '@/hooks/useNetworkOperations';
import { withTimeout } from '@/utils/errorHandling';

// Export the setupGenerationTimeout function that's implemented in generationLogic.ts
export { setupGenerationTimeout } from './generationLogic';

export const handleLetterGeneration = async (
  jobData: JobFormData,
  user: User | null,
  loadingState: string,
  selectedJob: any,
  isMountedRef: React.MutableRefObject<boolean>,
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  abortGeneration: () => void,
  incrementAttempt: () => void,
  updatePhase: (phase: string, progress: number, message: string) => void,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  toastMessages: any,
  toast: any,
  generationSteps: any,
  handleGenerationError: any,
  setupGenerationTimeout: any
) => {
  const { executeWithRetry } = useNetworkOperations();

  try {
    // Validate inputs and setup
    if (!user || loadingState === "generating") {
      return null;
    }

    const [timeoutPromise, timeoutId] = setupGenerationTimeout();
    abortControllerRef.current = new AbortController();

    try {
      // Execute generation with retry capability
      const result = await executeWithRetry(async () => {
        // Step 1: Fetch user profile with retry
        const userInfo = await withTimeout(
          generationSteps.fetchUserStep(),
          30000,
          'Bruger profil hentning tog for lang tid'
        );

        if (!isMountedRef.current) return null;

        // Step 2: Save job details with retry
        const jobId = await withTimeout(
          generationSteps.saveJobStep(jobData, user.id, selectedJob?.id),
          30000,
          'Gem job detaljer tog for lang tid'
        );

        if (!isMountedRef.current) return null;

        // Step 3: Generate letter content with retry
        const content = await withTimeout(
          generationSteps.generateLetterStep(jobData, userInfo),
          60000,
          'Generering af ansøgning tog for lang tid'
        );

        if (!isMountedRef.current || abortControllerRef.current?.signal.aborted) {
          return null;
        }

        // Step 4: Save the generated letter with retry
        const letter = await withTimeout(
          generationSteps.saveLetterStep(user.id, jobId, content),
          30000,
          'Gem ansøgning tog for lang tid'
        );

        if (!isMountedRef.current) return null;

        // Step 5: Fetch final job details
        const updatedJob = await generationSteps.fetchUpdatedJobStep(jobId, jobData, user.id);

        return { job: updatedJob, letter };
      }, 'generere ansøgningen');

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      toast(toastMessages.letterGenerated);
      return result;

    } catch (error) {
      handleGenerationError(error, incrementAttempt(), timeoutId);
      return null;
    }

  } catch (error) {
    console.error('Fatal error in handleLetterGeneration:', error);
    handleGenerationError(error, incrementAttempt(), null);
    return null;
  }
};
