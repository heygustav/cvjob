
import { useCallback } from "react";
import { CoverLetter } from "@/lib/types";

interface UseLetterEditProps {
  generatedLetter: CoverLetter | null;
  propHandleEditLetter?: (content: string) => Promise<void>;
  handleEditContent?: (content: string) => Promise<void>;
  hookSetGeneratedLetter?: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
}

export const useLetterEdit = ({
  generatedLetter,
  propHandleEditLetter,
  handleEditContent,
  hookSetGeneratedLetter
}: UseLetterEditProps) => {
  const onEditContent = useCallback(async (updatedContent: string) => {
    if (!generatedLetter) {
      console.error("Cannot edit letter: No letter available");
      return;
    }
    
    try {
      console.log("Editing letter content");
      
      // Use prop function if available, otherwise use hook function
      if (propHandleEditLetter) {
        await propHandleEditLetter(updatedContent);
      } else if (handleEditContent) {
        await handleEditContent(updatedContent);
      } else if (hookSetGeneratedLetter) {
        // Simple update if no handler is provided
        hookSetGeneratedLetter({
          ...generatedLetter,
          content: updatedContent,
          updated_at: new Date().toISOString()
        });
      }
      
      console.log("Letter content updated successfully");
    } catch (error) {
      console.error("Error updating letter content:", error);
    }
  }, [generatedLetter, handleEditContent, hookSetGeneratedLetter, propHandleEditLetter]);

  return onEditContent;
};
