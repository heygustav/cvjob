
import * as mammoth from 'mammoth';
import { PersonalInfoFormState } from '@/pages/Profile';
import { ProcessResult } from './types';
import { parseResumeText } from './textParser';
import { calculateConfidence } from './confidenceCalculator';
import { pdfjs } from '@/utils/pdfjs-setup';

/**
 * Extract text from a PDF document
 * @param file The PDF file to process
 * @returns Extracted text from the PDF
 */
async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    
    console.log("Loading PDF document");
    // Load the PDF document
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    console.log("PDF loaded successfully, pages:", pdf.numPages);
    
    let extractedText = '';
    
    // Iterate through each page
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        console.log(`Processing page ${i} of ${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        extractedText += pageText + '\n';
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        // Continue processing other pages even if one fails
      }
    }
    
    console.log("Text extraction complete, length:", extractedText.length);
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error('Kunne ikke læse PDF-filen korrekt.');
  }
}

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
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        extractedText = await extractTextFromPdf(file);
        console.log("Extracted text from PDF:", extractedText.substring(0, 200) + "...");
      } catch (error) {
        console.error("Error processing PDF:", error);
        return {
          success: false,
          error: 'Kunne ikke læse PDF-filen. Kontrollér filen eller udfyld oplysningerne manuelt.'
        };
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.name.toLowerCase().endsWith('.docx')) {
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
