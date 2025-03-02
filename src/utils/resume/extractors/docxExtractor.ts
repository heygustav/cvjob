
import * as mammoth from 'mammoth';

/**
 * Extract text from a DOCX document
 * @param file The DOCX file to process
 * @returns Extracted text from the DOCX
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    console.log(`Starting DOCX extraction for file: ${file.name}, size: ${file.size}`);
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const extractedText = result.value;
    
    console.log(`DOCX extraction complete. Total characters extracted: ${extractedText.length}`);
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    throw new Error('Kunne ikke læse DOCX-filen. Kontrollér filen eller udfyld oplysningerne manuelt.');
  }
}
