
import { useEffect } from "react";
import { User } from "@/lib/types";

interface UseExistingLetterArgs {
  existingLetterId?: string;
  completeUser: User | null;
  isMountedRef: React.MutableRefObject<boolean>;
  setStep: (step: 1 | 2) => void;
  fetchLetter: (id: string) => Promise<any>;
}

export const useExistingLetter = ({
  existingLetterId,
  completeUser,
  isMountedRef,
  setStep,
  fetchLetter
}: UseExistingLetterArgs) => {
  // Handle existing letter
  useEffect(() => {
    const loadExistingLetter = async () => {
      if (existingLetterId && completeUser?.id) {
        try {
          const letter = await fetchLetter(existingLetterId);
          if (letter && isMountedRef.current) {
            setStep(2);
          }
        } catch (error) {
          console.error("Error fetching letter:", error);
        }
      }
    };

    loadExistingLetter();
  }, [existingLetterId, completeUser?.id, fetchLetter, isMountedRef, setStep]);
};
