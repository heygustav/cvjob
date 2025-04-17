
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { generateCoverLetterFilename } from '@/utils/fileNaming';
import { getTextContent } from '@/utils/download/contentExtractor';

interface FileNameParams {
  fullName?: string;
  jobTitle?: string;
  companyName?: string;
}

interface DocumentOptions {
  content: string;
  company?: string;
  jobTitle?: string;
  formattedDate?: string;
}

/**
 * Create a PDF document from content
 */
export const createPdfDocument = (options: DocumentOptions): jsPDF => {
  const { content } = options;
  
  // Create PDF document
  const doc = new jsPDF();
  
  // Add content to PDF
  const splitText = doc.splitTextToSize(content, 180);
  doc.text(splitText, 15, 15);
  
  return doc;
};

/**
 * Create a DOCX document from content
 */
export const createDocxDocument = (options: DocumentOptions): Document => {
  const { content } = options;
  
  // Create DOCX document
  return new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun(content),
          ],
        }),
      ],
    }],
  });
};

/**
 * Save a DOCX document to file
 */
export const saveDocxDocument = async (doc: Document, filename: string): Promise<void> => {
  // Generate buffer
  const buffer = await Packer.toBuffer(doc);
  
  // Create Blob from buffer
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  
  // Save file
  saveAs(blob, filename);
};

/**
 * Create a plain text document from content
 */
export const createTextDocument = (options: DocumentOptions): string => {
  return options.content;
};

/**
 * Save a plain text document to file
 */
export const saveTextDocument = (content: string, filename: string): void => {
  // Create Blob from text
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  
  // Save file
  saveAs(blob, filename);
};

/**
 * Process document content for download
 * @param content HTML or text content
 * @returns Clean text content
 */
export const processContentForDownload = (content: string): string => {
  return getTextContent(content);
};

/**
 * Generate filename based on document parameters
 */
export const generateDocumentFilename = (
  extension: string,
  params: FileNameParams
): string => {
  return generateCoverLetterFilename(extension, params);
};
