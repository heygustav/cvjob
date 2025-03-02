
import { PersonalInfoFormState } from '@/pages/Profile';
import { ProcessResult } from './types';
import { parseResumeText } from './textParser';
import { calculateConfidence } from './confidenceCalculator';
import { extractTextFromFile } from './extractors/fileFormatHandler';

/**
 * Process a resume file on the client side
 * @param file The file to process (PDF or DOCX)
 * @returns A ProcessResult with the extracted data or error information
 */
export const processPdfFile = async (file: File): Promise<ProcessResult> => {
  try {
    let extractedText: string;
    
    try {
      extractedText = await extractTextFromFile(file);
      console.log("Extracted text from file:", extractedText.substring(0, 200) + "...");
    } catch (error) {
      console.error("Error processing file:", error);
      return {
        success: false,
        error: error.message || 'Kunne ikke læse filen. Kontrollér filen eller udfyld oplysningerne manuelt.'
      };
    }
    
    // Parse the extracted text to get structured data
    const extractedData = parseResumeText(extractedText);
    
    if (Object.keys(extractedData).length === 0) {
      return {
        success: false,
        error: 'Kunne ikke finde relevante oplysninger i dokumentet. Venligst udfyld oplysningerne manuelt.'
      };
    }
    
    // Return the extracted data
    return {
      success: true,
      data: {
        validatedData: extractedData,
        extractedFields: Object.keys(extractedData),
        confidence: calculateConfidence(extractedData, extractedText)
      }
    };
  } catch (error: any) {
    console.error('Error processing resume:', error);
    return {
      success: false,
      error: error.message || 'Der opstod en fejl under behandling af filen'
    };
  }
};
