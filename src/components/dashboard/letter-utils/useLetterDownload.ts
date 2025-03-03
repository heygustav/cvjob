
import { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { CoverLetter, JobPosting } from "@/lib/types";

export function useLetterDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to download as PDF
  const handleDownloadPdf = useCallback(async (letter: CoverLetter, job?: JobPosting) => {
    try {
      setIsDownloading(true);
      
      // Create a filename based on company and job title
      const companyName = job?.company || "ukendt-virksomhed";
      const jobTitle = job?.title || "ukendt-stilling";
      const fileName = `ansøgning-${companyName.toLowerCase().replace(/\s+/g, '-')}-${jobTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      
      // Format the current date in Danish
      const currentDate = new Date();
      const formattedDate = format(currentDate, "d. MMMM yyyy", { locale: da });
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      // Set font
      doc.setFont("helvetica");
      
      // Add company name (bold)
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(companyName, 20, 20);
      
      // Add attention line
      doc.setFont("helvetica", "normal");
      doc.text(`Att.: Ansøgning til ${jobTitle}`, 20, 30);
      
      // Add date (right-aligned)
      const dateWidth = doc.getStringUnitWidth(formattedDate) * doc.getFontSize() / doc.internal.scaleFactor;
      doc.text(formattedDate, doc.internal.pageSize.width - 20 - dateWidth, 30);
      
      // Add a spacing before content
      const contentStartY = 50;
      
      // Add the main content
      doc.setFontSize(11);
      
      // Split content into lines that fit within the page width
      const textLines = doc.splitTextToSize(letter.content, 170);
      
      // Add the text to the PDF
      doc.text(textLines, 20, contentStartY);
      
      // Save the PDF
      doc.save(fileName);
    } catch (error) {
      console.error("Error downloading letter as PDF:", error);
      alert("Der opstod en fejl under download af ansøgning.");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // Function to download as text file
  const handleDownloadTxt = useCallback(async (letter: CoverLetter, job?: JobPosting) => {
    try {
      setIsDownloading(true);
      
      // Create a filename based on company and job title
      const companyName = job?.company || "ukendt-virksomhed";
      const jobTitle = job?.title || "ukendt-stilling";
      const fileName = `ansøgning-${companyName.toLowerCase().replace(/\s+/g, '-')}-${jobTitle.toLowerCase().replace(/\s+/g, '-')}.txt`;
      
      // Format the current date in Danish
      const currentDate = new Date();
      const formattedDate = format(currentDate, "d. MMMM yyyy", { locale: da });
      
      // Create the letter content
      const letterHeader = `${companyName}\nAtt.: Ansøgning til ${jobTitle}\n\n${formattedDate}\n\n`;
      const letterContent = letterHeader + letter.content;
      
      // Create and download the text file
      const element = document.createElement("a");
      const file = new Blob([letterContent], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Error downloading letter as text:", error);
      alert("Der opstod en fejl under download af ansøgning.");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // Function to download as Word document
  const handleDownloadDocx = useCallback(async (letter: CoverLetter, job?: JobPosting) => {
    try {
      setIsDownloading(true);
      
      // Create a filename based on company and job title
      const companyName = job?.company || "ukendt-virksomhed";
      const jobTitle = job?.title || "ukendt-stilling";
      const fileName = `ansøgning-${companyName.toLowerCase().replace(/\s+/g, '-')}-${jobTitle.toLowerCase().replace(/\s+/g, '-')}.docx`;
      
      // Format the current date in Danish
      const currentDate = new Date();
      const formattedDate = format(currentDate, "d. MMMM yyyy", { locale: da });
      
      // Create a new document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Company name
              new Paragraph({
                text: companyName,
                heading: HeadingLevel.HEADING_3,
              }),
              
              // Job title
              new Paragraph({
                text: `Att.: Ansøgning til ${jobTitle}`,
                spacing: {
                  after: 200,
                },
              }),
              
              // Date - right-aligned
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: formattedDate,
                  }),
                ],
                spacing: {
                  after: 400,
                },
              }),
              
              // Content - split by paragraphs
              ...letter.content.split("\n\n").map(paragraph => 
                new Paragraph({
                  text: paragraph,
                  spacing: {
                    after: 200,
                  },
                })
              ),
            ],
          },
        ],
      });
      
      // Generate and download the document
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, fileName);
      });
    } catch (error) {
      console.error("Error downloading letter as Word document:", error);
      alert("Der opstod en fejl under download af ansøgning.");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    isDownloading,
    handleDownloadPdf,
    handleDownloadDocx,
    handleDownloadTxt
  };
}
