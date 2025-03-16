
import { useMemo } from "react";
import { CoverLetter } from "@/lib/types";

interface UseLetterEditArgs {
  generatedLetter: CoverLetter | null;
  propHandleEditLetter?: (content: string) => Promise<void>;
  handleEditContent: (content: string) => Promise<void>;
  hookSetGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
}

export const useLetterEdit = ({
  generatedLetter,
  propHandleEditLetter,
  handleEditContent,
  hookSetGeneratedLetter
}: UseLetterEditArgs) => {
  
  // Memoize letter edit handler to prevent unnecessary re-renders
  return useMemo(() => async (content: string) => {
    if (!generatedLetter) return;
    
    if (propHandleEditLetter) {
      await propHandleEditLetter(content);
    } else {
      try {
        await handleEditContent(content);
        hookSetGeneratedLetter({
          ...generatedLetter,
          content,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error updating letter:", err);
      }
    }
  }, [generatedLetter, propHandleEditLetter, handleEditContent, hookSetGeneratedLetter]);
};
