
import { PersonalInfoFormState } from '@/pages/Profile';

export interface ParsedSection {
  text: string;
  confidence: number;
}

export interface ParsedResumeData {
  validatedData: Partial<PersonalInfoFormState>;
  extractedFields: string[];
  confidence?: {
    [key: string]: number;
  };
}

export interface ProcessResult {
  success: boolean;
  data?: ParsedResumeData;
  error?: string;
}
