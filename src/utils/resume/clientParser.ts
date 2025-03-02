
import * as mammoth from 'mammoth';
import { PersonalInfoFormState } from '@/pages/Profile';
import { ProcessResult } from './types';
import { parseResumeText } from './textParser';
import { calculateConfidence } from './confidenceCalculator';

/**
 * Process a resume file on the client side
 * @param file The file to process (PDF or DOCX)
 * @returns A ProcessResult with the extracted data or error information
 */
export const processPdfFile = async (file: File): Promise<ProcessResult> => {
  try {
    console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    
    let extractedText = '';
    
    // Handle different file types
    if (file.type === 'application/pdf') {
      // For PDF, we currently have limited support
      return {
        success: false, 
        error: 'PDF-analyse er midlertidigt begrænset. Vi arbejder på at forbedre denne funktion. Venligst udfyld oplysningerne manuelt.'
      };
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Process DOCX files using mammoth
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
        console.log("Extracted text from DOCX:", extractedText.substring(0, 200) + "...");
      } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        return {
          success: false,
          error: 'Kunne ikke læse DOCX-filen. Kontrollér filen eller udfyld oplysningerne manuelt.'
        };
      }
    } else {
      return {
        success: false,
        error: 'Ukendt filformat. Venligst upload en PDF eller DOCX fil.'
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
