
import { User } from "@/lib/types";
import { useCoverLetterGeneration as useCoverLetterGenerationImpl } from "./coverLetter/letterGeneration";

/**
 * Main hook for cover letter generation functionality
 * This is the primary entry point for consuming the letter generation functionality
 */
export const useCoverLetterGeneration = (user: User | null) => {
  return useCoverLetterGenerationImpl(user);
};
