
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { createPdfDocument, generatePdfFilename, PdfDocumentOptions } from "../factories/pdfDocumentFactory";
import { createDocxDocument, generateDocxFilename, saveDocxDocument, DocxDocumentOptions } from "../factories/docxDocumentFactory";
import { createTextDocument, generateTextFilename, TextDocumentOptions } from "../factories/textDocumentFactory";

export const useCoverLetterDocuments = (
  content: string,
  company?: string,
  jobTitle?: string
) => {
  const { toast } = useToast();
  const currentDate = new Date();
  // Format the date in Danish, e.g., "1. februar 2025"
  const formattedDate = format(currentDate, "d. MMMM yyyy", { locale: da });

  // Function to download as text file
  const handleDownloadTxt = useCallback(() => {
    try {
      const documentOptions: TextDocumentOptions = {
        content,
        company,
        jobTitle,
        formattedDate
      };
      
      const documentText = createTextDocument(documentOptions);
      const filename = generateTextFilename(company, jobTitle);
      
      const element = document.createElement("a");
      const file = new Blob([documentText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: "Download startet",
        description: "Din ansøgning bliver downloadet som tekstfil.",
      });
    } catch (error) {
      console.error("Error generating text file:", error);
      toast({
        title: "Fejl ved generering af tekstfil",
        description: "Der opstod en fejl. Prøv igen senere.",
        variant: "destructive",
      });
    }
  }, [content, company, jobTitle, formattedDate, toast]);

  // Function to download as PDF
  const handleDownloadPdf = useCallback(() => {
    try {
      const documentOptions: PdfDocumentOptions = {
        content,
        company,
        jobTitle,
        formattedDate
      };
      
      const doc = createPdfDocument(documentOptions);
      const filename = generatePdfFilename(company, jobTitle);
      doc.save(filename);
      
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
      const documentOptions: DocxDocumentOptions = {
        content,
        company,
        jobTitle,
        formattedDate
      };
      
      const doc = createDocxDocument(documentOptions);
      const filename = generateDocxFilename(company, jobTitle);
      
      saveDocxDocument(doc, filename).then(() => {
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
