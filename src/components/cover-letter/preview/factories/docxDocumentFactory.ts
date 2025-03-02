
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export interface DocxDocumentOptions {
  content: string;
  company?: string;
  jobTitle?: string;
  formattedDate: string;
}

/**
 * Factory for creating Word documents from cover letter content
 */
export const createDocxDocument = ({
  content,
  company = "Virksomhed",
  jobTitle = "stillingen",
  formattedDate
}: DocxDocumentOptions): Document => {
  // Create a new document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Company name - bold
          new Paragraph({
            children: [
              new TextRun({
                text: company,
                bold: true,
              }),
            ],
          }),
          
          // Job title - bold
          new Paragraph({
            children: [
              new TextRun({
                text: `Att.: Ansøgning til ${jobTitle}`,
                bold: true,
              }),
            ],
            spacing: {
              after: 200,
            },
          }),
          
          // Date - right-aligned and bold
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: formattedDate,
                bold: true,
              }),
            ],
            spacing: {
              after: 400,
            },
          }),
          
          // Content - split by paragraphs with reduced spacing
          ...content.split("\n\n").map(paragraph => 
            new Paragraph({
              text: paragraph,
              spacing: {
                after: 100,
              },
            })
          ),
        ],
      },
    ],
  });
  
  return doc;
};

/**
 * Generate a Word document filename based on company and job title
 */
export const generateDocxFilename = (company: string = "Virksomhed", jobTitle: string = "Stilling"): string => {
  return `Ansøgning - ${company} - ${jobTitle}.docx`;
};

/**
 * Helper function to save the document as a file
 */
export const saveDocxDocument = async (doc: Document, filename: string): Promise<void> => {
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
