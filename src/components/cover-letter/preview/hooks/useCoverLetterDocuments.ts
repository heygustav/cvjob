
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export const useCoverLetterDocuments = (
  content: string,
  company?: string,
  jobTitle?: string
) => {
  const { toast } = useToast();
  const currentDate = new Date();
  // Format the date in Danish, e.g., "1. februar 2025"
  const formattedDate = format(currentDate, "d. MMMM yyyy", { locale: da });

  // Function to create formatted letter content with header
  const getFormattedLetterContent = useCallback(() => {
    const letterHeader = `${company || "Virksomhed"}\nAtt.: Ansøgning til ${jobTitle || "stillingen"}\n\n`;
    return letterHeader + content;
  }, [content, company, jobTitle]);

  // Function to download as text file
  const handleDownloadTxt = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([getFormattedLetterContent()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Ansøgning - ${company || "Virksomhed"} - ${
      jobTitle || "Stilling"
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download startet",
      description: "Din ansøgning bliver downloadet som tekstfil.",
    });
  }, [getFormattedLetterContent, company, jobTitle, toast]);

  // Function to download as PDF
  const handleDownloadPdf = useCallback(() => {
    try {
      const doc = new jsPDF();
      const companyName = company || "Virksomhed";
      const jobTitleText = jobTitle || "stillingen";
      
      // Set font for the entire document
      doc.setFont("helvetica", "normal");
      
      // Add company and job title in bold
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(companyName, 20, 20);
      doc.text(`Att.: Ansøgning til ${jobTitleText}`, 20, 30);
      
      // Add date on the right in bold
      const dateText = formattedDate;
      const dateWidth = doc.getStringUnitWidth(dateText) * 12 / doc.internal.scaleFactor;
      doc.text(dateText, doc.internal.pageSize.width - 20 - dateWidth, 30);
      
      // Reset to normal font for the content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      // Split content by new lines and add line by line to handle word wrapping
      const contentLines = content.split("\n");
      let yPosition = 50;
      // Reduced line height from 7 to 5 for more compact paragraphs
      const lineHeight = 5;
      
      contentLines.forEach(line => {
        // Use splitTextToSize to handle word wrapping (limit line width to 170 mm)
        const wrappedText = doc.splitTextToSize(line, 170);
        wrappedText.forEach(wrappedLine => {
          doc.text(wrappedLine, 20, yPosition);
          yPosition += lineHeight;
          
          // Add a new page if we're near the bottom - increased max height to use more of the page
          if (yPosition > 285) {
            doc.addPage();
            yPosition = 20;
          }
        });
        
        // Reduced paragraph spacing from 3 to 1
        yPosition += 1;
      });
      
      // Save the PDF
      doc.save(`Ansøgning - ${companyName} - ${jobTitleText}.pdf`);
      
      toast({
        title: "PDF download startet",
        description: "Din ansøgning bliver downloadet som PDF.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Fejl ved generering af PDF",
        description: "Der opstod en fejl. Prøv igen senere.",
        variant: "destructive",
      });
    }
  }, [content, company, jobTitle, formattedDate, toast]);

  // Function to download as Word document
  const handleDownloadDocx = useCallback(() => {
    try {
      const companyName = company || "Virksomhed";
      const jobTitleText = jobTitle || "stillingen";
      
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
                    text: companyName,
                    bold: true,
                  }),
                ],
              }),
              
              // Job title - bold
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Att.: Ansøgning til ${jobTitleText}`,
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
                    // Reduced spacing from 200 to 100
                    after: 100,
                  },
                })
              ),
            ],
          },
        ],
      });
      
      // Generate and download the document
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, `Ansøgning - ${companyName} - ${jobTitleText}.docx`);
        toast({
          title: "Word download startet",
          description: "Din ansøgning bliver downloadet som Word-dokument.",
        });
      });
    } catch (error) {
      console.error("Error generating Word document:", error);
      toast({
        title: "Fejl ved generering af Word-dokument",
        description: "Der opstod en fejl. Prøv igen senere.",
        variant: "destructive",
      });
    }
  }, [content, company, jobTitle, formattedDate, toast]);

  return {
    formattedDate,
    handleDownloadTxt,
    handleDownloadPdf,
    handleDownloadDocx
  };
};
