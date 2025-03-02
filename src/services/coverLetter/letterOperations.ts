
import { supabase } from "@/integrations/supabase/client";
import { CoverLetter } from "@/lib/types";

export const fetchLettersForJob = async (jobId: string) => {
  console.log("Fetching letters for job:", jobId);
  
  const { data: letters, error: letterError } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("job_posting_id", jobId);

  if (letterError) {
    console.error("Error fetching letters:", letterError);
    throw letterError;
  }

  return letters as CoverLetter[];
};

export const fetchLetterById = async (id: string) => {
  console.log("Fetching letter with ID:", id);
  
  const { data: letter, error: letterError } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (letterError) {
    console.error("Error fetching letter:", letterError);
    throw letterError;
  }

  if (!letter) {
    console.log("No letter found with ID:", id);
    return null;
  }

  return letter as CoverLetter;
};

export const saveCoverLetter = async (
  userId: string,
  jobId: string,
  content: string
): Promise<CoverLetter> => {
  console.log("Saving letter to database");
  
  const { data: letter, error: letterError } = await supabase
    .from("cover_letters")
    .insert({
      user_id: userId,
      job_posting_id: jobId,
      content: content
    })
    .select()
    .single();

  if (letterError) {
    console.error("Error saving letter:", letterError);
    throw new Error(`Fejl ved gem af ansøgning: ${letterError.message}`);
  }

  console.log("Letter saved successfully:", letter);
  return letter as CoverLetter;
};

export const updateLetterContent = async (
  letterId: string, 
  updatedContent: string
): Promise<void> => {
  console.log("Updating letter content:", letterId);
  
  const { error } = await supabase
    .from("cover_letters")
    .update({
      content: updatedContent,
      updated_at: new Date().toISOString()
    })
    .eq("id", letterId);

  if (error) {
    console.error("Error updating letter content:", error);
    throw error;
  }
  
  console.log("Letter content updated successfully");
};
