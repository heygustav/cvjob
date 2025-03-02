
import { pdfjs } from '@/utils/pdfjs-setup';

/**
 * Extract text from a PDF document
 * @param file The PDF file to process
 * @returns Extracted text from the PDF
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    console.log(`Starting PDF extraction for file: ${file.name}, size: ${file.size}`);
    
    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    console.log("File converted to ArrayBuffer successfully");
    
    // Check if worker is configured properly
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      console.error("PDF.js worker source is not configured");
      throw new Error('PDF.js worker is not configured. Please refresh the page and try again.');
    }
    
    console.log("Creating PDF document loading task with worker at:", pdfjs.GlobalWorkerOptions.workerSrc);
    
    // Load the PDF document with error handling
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    
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
    
    // Check for specific PDF.js worker errors
    if (error.message && error.message.includes('worker')) {
      throw new Error('PDF-læser komponenten kunne ikke indlæses. Prøv en anden browser eller upload en DOCX-fil i stedet.');
    } else if (error.message && error.message.includes('fetch')) {
      throw new Error('PDF-læser komponenten kunne ikke indlæses. Tjek din internetforbindelse eller prøv en anden browser.');
    } else if (error.message && error.message.includes('password')) {
      throw new Error('PDF-filen er krypteret med en adgangskode. Fjern adgangskoden og prøv igen.');
    } else if (error.message && error.message.includes('corrupt')) {
      throw new Error('PDF-filen er beskadiget. Prøv at gemme den igen eller brug en anden fil.');
    }
    
    // Generic error message
    throw new Error('Kunne ikke læse PDF-filen. Prøv at uploade en DOCX-fil i stedet.');
  }
}
