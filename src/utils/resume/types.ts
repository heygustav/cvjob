
import { PersonalInfoFormState } from '@/pages/Profile';

export interface ParsedResumeData {
  validatedData: Partial<PersonalInfoFormState>;
  extractedFields: string[];
}

export interface ProcessResult {
  success: boolean;
  data?: ParsedResumeData;
  error?: string;
}
