
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { da } from "date-fns/locale";

export interface PdfDocumentOptions {
  content: string;
  company?: string;
  jobTitle?: string;
  formattedDate: string;
}

/**
 * Factory for creating PDF documents from cover letter content
 */
export const createPdfDocument = ({
  content,
  company = "Virksomhed",
  jobTitle = "stillingen",
  formattedDate
}: PdfDocumentOptions): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set font for the entire document
  doc.setFont("helvetica", "normal");
  
  // Add company and job title in bold
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(company, 20, 20);
  doc.text(`Att.: Ansøgning til ${jobTitle}`, 20, 30);
  
  // Add date on the right in bold
  const dateWidth = doc.getStringUnitWidth(formattedDate) * 12 / doc.internal.scaleFactor;
  doc.text(formattedDate, doc.internal.pageSize.width - 20 - dateWidth, 30);
  
  // Reset to normal font for the content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  // Split content by new lines and add line by line to handle word wrapping
  const contentLines = content.split("\n");
  let yPosition = 50;
  // Set line height to 1 (reduced from previous value)
  const lineHeight = 4; // Reduced for tighter spacing
  
  contentLines.forEach(line => {
    // Use splitTextToSize to handle word wrapping (limit line width to 170 mm)
    const wrappedText = doc.splitTextToSize(line, 170);
    wrappedText.forEach(wrappedLine => {
      doc.text(wrappedLine, 20, yPosition);
      yPosition += lineHeight;
      
      // Add a new page if we're near the bottom
      if (yPosition > 285) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Small paragraph spacing (reduced from before)
    yPosition += 1;
  });
  
  return doc;
};

/**
 * Generate a PDF filename based on company and job title
 */
export const generatePdfFilename = (company: string = "Virksomhed", jobTitle: string = "Stilling"): string => {
  return `Ansøgning - ${company} - ${jobTitle}.pdf`;
};
