
import { useState, useRef, useEffect } from "react";
import { User } from "@/lib/types";
import { useCoverLetterGeneration as useRefactoredCoverLetterGeneration } from "./coverLetter/generation";

export const useCoverLetterGeneration = (user: User | null) => {
  return useRefactoredCoverLetterGeneration(user);
};
