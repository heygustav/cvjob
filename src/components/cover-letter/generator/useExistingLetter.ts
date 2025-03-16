
import { useEffect } from "react";
import { CoverLetter } from "@/lib/types";
import { User } from "@/lib/types";

interface UseExistingLetterProps {
  existingLetterId?: string;
  completeUser: User | null;
  isMountedRef: React.MutableRefObject<boolean>;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  fetchLetter: (id: string) => Promise<CoverLetter | null>;
}

export const useExistingLetter = ({
  existingLetterId,
  completeUser,
  isMountedRef,
  setStep,
  fetchLetter
}: UseExistingLetterProps) => {
  // Load existing letter if we have an ID
  useEffect(() => {
    if (existingLetterId && completeUser?.id) {
      const loadExistingLetter = async () => {
        try {
          console.log(`Loading existing letter: ${existingLetterId}`);
          await fetchLetter(existingLetterId);
          
          if (isMountedRef.current) {
            setStep(2);
          }
        } catch (error) {
          console.error("Error loading existing letter:", error);
        }
      };
      
      loadExistingLetter();
    }
  }, [existingLetterId, completeUser?.id, fetchLetter, isMountedRef, setStep]);
};
