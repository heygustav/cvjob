
import { useEffect } from "react";
import { User } from "@/lib/types";

interface GeneratorInitializationProps {
  isAuthenticated: boolean;
  jobId: string | null;
  letterId: string | null;
  stepParam: string | null;
  isDirect: boolean;
  user: User | null;
  authUser: any;
  initStarted: React.MutableRefObject<boolean>;
  isMountedRef: React.MutableRefObject<boolean>;
  setInitialLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: (step: 1 | 2) => void;
  fetchJob: (id: string) => Promise<any>;
  fetchLetter: (id: string) => Promise<any>;
}

export const useGeneratorInitialization = ({
  isAuthenticated,
  jobId,
  letterId,
  stepParam,
  isDirect,
  user,
  authUser,
  initStarted,
  isMountedRef,
  setInitialLoading,
  setStep,
  fetchJob,
  fetchLetter
}: GeneratorInitializationProps) => {
  useEffect(() => {
    const initialize = async () => {
      if (initStarted.current) return;
      initStarted.current = true;
      
      try {
        // Set the step if specified in URL
        if (stepParam) {
          const step = parseInt(stepParam);
          if (step === 1 || step === 2) {
            setStep(step as 1 | 2);
          }
        }
        
        // Fetch letter if ID is provided
        if (letterId && isAuthenticated) {
          await fetchLetter(letterId);
        }
        // Fetch job if ID is provided
        else if (jobId && isAuthenticated) {
          await fetchJob(jobId);
        }
        
      } catch (error) {
        console.error("Error initializing generator:", error);
      } finally {
        if (isMountedRef.current) {
          setInitialLoading(false);
        }
      }
    };
    
    initialize();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [isAuthenticated, jobId, letterId, stepParam, isDirect, user, authUser, initStarted, isMountedRef, setInitialLoading, setStep, fetchJob, fetchLetter]);
};
