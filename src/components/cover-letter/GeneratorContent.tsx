
import React from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter } from "@/lib/types";
import { GenerationProgress, LoadingState } from "@/hooks/coverLetter/types";
import { GeneratorContent as RefactoredGeneratorContent } from "./generator/GeneratorContent";

interface GeneratorProps {
  existingLetterId?: string;
  step?: 1 | 2;
  isGenerating?: boolean;
  isLoading?: boolean;
  loadingState?: LoadingState;
  generationPhase?: string | null;
  generationProgress?: GenerationProgress;
  selectedJob?: any;
  generatedLetter?: CoverLetter | null;
  generationError?: string | null;
  setStep?: (step: 1 | 2) => void;
  handleJobFormSubmit?: (jobData: JobFormData) => Promise<void>;
  handleEditLetter?: (updatedContent: string) => Promise<void>;
  handleSaveJobAsDraft?: (jobData: JobFormData) => Promise<void>;
  resetError?: () => void;
}

export const GeneratorContent: React.FC<GeneratorProps> = (props) => {
  // Simply pass all props to the refactored component
  return <RefactoredGeneratorContent {...props} />;
};

// Add displayName for debugging
GeneratorContent.displayName = 'GeneratorContent';

export default GeneratorContent;
