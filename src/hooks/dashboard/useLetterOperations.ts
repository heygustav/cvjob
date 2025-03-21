
import { useState } from "react";
import { CoverLetter } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for cover letter operations (delete)
 */
export const useLetterOperations = (
  coverLetters: CoverLetter[],
  setCoverLetters: (letters: CoverLetter[]) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const deleteCoverLetter = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("cover_letters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCoverLetters(coverLetters.filter(letter => letter.id !== id));

      toast({
        title: "Ansøgning slettet",
        description: "Ansøgningen er blevet slettet.",
      });
    } catch (error) {
      console.error("Error deleting cover letter:", error);
      toast({
        title: "Fejl ved sletning",
        description: "Der opstod en fejl under sletning af ansøgningen.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteCoverLetter
  };
};
