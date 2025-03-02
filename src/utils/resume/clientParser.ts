
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
    console.log(`Starting PDF extraction for file: ${file.name}, size: ${file.size}`);
    
    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    console.log("File converted to ArrayBuffer successfully");
    
    // Check if worker is configured
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      throw new Error('PDF.js worker is not configured. Please refresh the page and try again.');
    }
    
    console.log("Creating PDF document loading task with worker at:", pdfjs.GlobalWorkerOptions.workerSrc);
    
    // Load the PDF document with error handling
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    
    // Add error handler to the loadingTask
    loadingTask.onUnsupportedFeature = (featureId) => {
      console.warn('Unsupported PDF feature:', featureId);
    };
    
    console.log("Awaiting PDF document loading");
    
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded successfully with ${pdf.numPages} pages`);
    
    let extractedText = '';
    
    // Iterate through each page
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        console.log(`Processing page ${i} of ${pdf.numPages}`);
        const page = await pdf.getPage(i);
        console.log(`Page ${i} retrieved successfully`);
        
        const textContent = await page.getTextContent();
        console.log(`Text content extracted from page ${i}`);
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        extractedText += pageText + '\n';
        console.log(`Added ${pageText.length} characters from page ${i}`);
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        // Continue processing other pages even if one fails
      }
    }
    
    console.log(`Text extraction complete. Total characters extracted: ${extractedText.length}`);
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    
    // Provide more specific error messages based on the error type
    if (error.message && error.message.includes('worker')) {
      throw new Error('Kunne ikke indlæse PDF-læser komponenten. Prøv at genindlæse siden eller brug en anden browser.');
    } else if (error.message && error.message.includes('password')) {
      throw new Error('PDF-filen er krypteret med en adgangskode. Fjern adgangskoden og prøv igen.');
    } else if (error.message && error.message.includes('corrupt')) {
      throw new Error('PDF-filen er beskadiget. Prøv at gemme den igen eller brug en anden fil.');
    }
    
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
          error: error.message || 'Kunne ikke læse PDF-filen. Kontrollér filen eller udfyld oplysningerne manuelt.'
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
