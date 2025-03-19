
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface DocxDocumentOptions {
  content: string;
  company?: string;
  jobTitle?: string;
  formattedDate?: string;
}

export const createDocxDocument = (options: DocxDocumentOptions): Document => {
  const { content } = options;
  
  // Create DOCX document
  const doc = new Document({
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
  
  return doc;
};

export const saveDocxDocument = async (doc: Document, filename: string): Promise<void> => {
  // Generate buffer
  const buffer = await Packer.toBuffer(doc);
  
  // Create Blob from buffer
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  
  // Save file
  saveAs(blob, filename);
};
