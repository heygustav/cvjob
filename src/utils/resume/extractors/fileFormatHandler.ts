
import { extractTextFromPdf } from './pdfExtractor';
import { extractTextFromDocx } from './docxExtractor';

/**
 * Detects the file format and extracts text using the appropriate method
 * @param file The file to process
 * @returns Extracted text from the file
 */
export async function extractTextFromFile(file: File): Promise<string> {
  console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
  
  // Handle different file types
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return extractTextFromPdf(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
             file.name.toLowerCase().endsWith('.docx')) {
    return extractTextFromDocx(file);
  } else {
    throw new Error('Ukendt filformat. Venligst upload en PDF eller DOCX fil.');
  }
}
