
import jsPDF from 'jspdf';

interface PdfDocumentOptions {
  content: string;
  company?: string;
  jobTitle?: string;
  formattedDate?: string;
}

export const createPdfDocument = (options: PdfDocumentOptions): jsPDF => {
  const { content } = options;
  
  // Create PDF document
  const doc = new jsPDF();
  
  // Add content to PDF
  const splitText = doc.splitTextToSize(content, 180);
  doc.text(splitText, 15, 15);
  
  return doc;
};
