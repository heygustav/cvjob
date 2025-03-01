
import { PersonalInfoFormState } from '@/pages/Profile';

export interface ParsedSection {
  text: string;
  confidence: number;
}

export interface RawResumeData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  skills?: ParsedSection[] | string;
  education?: ParsedSection[] | string;
  experience?: ParsedSection[] | string;
  languages?: string[];
  confidence?: {
    [key: string]: number;
  };
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
