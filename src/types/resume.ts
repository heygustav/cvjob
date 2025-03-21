/**
 * Consolidated Resume type that can be used across all components
 * This type combines all properties from different interfaces used throughout the application
 */
export interface Resume {
  // Personal Information
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  
  // Short Summary
  summary: string;
  
  // Resume Content Sections - old format
  experience: string;
  education: string;
  skills: string;
  
  // New structured formats
  structuredExperience?: ExperienceEntry[];
  structuredEducation?: EducationEntry[];
  structuredSkills?: SkillEntry[];
  
  // Optional Properties
  photo?: string;
  languages?: string[];
  
  // Metadata
  created_at?: string;
  updated_at?: string;
  email_preferences?: Record<string, any>;
  
  // Template and Styling
  template?: "modern" | "classic" | "creative";
  
  // Validation and Processing
  confidence?: {
    [key: string]: number;
  };
}

/**
 * Structured experience entry
 */
export interface ExperienceEntry {
  id: string;
  position: string;
  organization: string;
  fromDate: string;
  toDate: string;
  bulletPoints: string[];
}

/**
 * Structured education entry
 */
export interface EducationEntry {
  id: string;
  education: string;
  school: string;
  fromDate: string;
  toDate: string;
  bulletPoints: string[];
}

/**
 * Structured skill entry
 */
export interface SkillEntry {
  id: string;
  skill: string;
  years: string;
  bulletPoints: string[];
}

/**
 * Resume form state type for form handling
 * This is a subset of the full Resume type, used for form inputs
 */
export type ResumeFormState = Omit<Resume, 'created_at' | 'updated_at' | 'email_preferences' | 'confidence' | 'id'>;

/**
 * Database Resume type that matches the database schema
 * Used when fetching from or sending to the database
 */
export type DbResume = Omit<Resume, 'photo' | 'template' | 'confidence' | 'languages'>;

/**
 * Parsed Resume data for PDF processing
 */
export interface ParsedResumeData {
  validatedData: Partial<Resume>;
  extractedFields: string[];
  confidence?: {
    [key: string]: number;
  };
}

/**
 * Section field for the resume editor
 */
export interface ResumeSectionField {
  key: keyof Resume;
  label: string;
  value: string;
  multiline?: boolean;
}

/**
 * Processing result for resume parsing
 */
export interface ProcessResult {
  success: boolean;
  data?: ParsedResumeData;
  error?: string;
}
