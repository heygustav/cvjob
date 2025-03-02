// This file is kept for compatibility but is no longer the main parsing implementation
// For demonstration purposes, we're keeping this file but not using its implementation

import { supabase } from '@/integrations/supabase/client';
import { fileToBase64, validateFile } from './fileUtils';
import { validateExtractedData } from './dataValidator';
import { ParsedResumeData, ProcessResult, RawResumeData } from './types';

// This function is kept for compatibility but replaced by the client-side implementation
export const processPdfFile = async (file: File): Promise<ProcessResult> => {
  console.log("Using client-side implementation instead");
  
  // Import the client-side implementation
  const { processPdfFile: clientParser } = await import('../resumeParser');
  return clientParser(file);
};
