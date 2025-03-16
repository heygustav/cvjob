
import { useMemo } from "react";
import { CoverLetter } from "@/lib/types";

interface UseLetterEditArgs {
  generatedLetter: CoverLetter | null;
  propHandleEditLetter?: (content: string) => Promise<void>;
  handleEditContent: (content: string) => Promise<string | void>;
  hookSetGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
}

export const useLetterEdit = ({
  generatedLetter,
  propHandleEditLetter,
  handleEditContent,
  hookSetGeneratedLetter
}: UseLetterEditArgs) => {
  
  // Memoize letter edit handler to prevent unnecessary re-renders
  return useMemo(() => async (content: string): Promise<void> => {
    if (!generatedLetter) return;
    
    if (propHandleEditLetter) {
      await propHandleEditLetter(content);
    } else {
      try {
        // We need to consume the return value without returning it
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
