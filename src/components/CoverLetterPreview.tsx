
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Copy, Edit, FileText, File, FileIcon } from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

interface CoverLetterPreviewProps {
  content: string;
  jobTitle?: string;
  company?: string;
  onEdit?: (content: string) => void;
  isEditable?: boolean;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  content,
  jobTitle,
  company,
  onEdit,
  isEditable = true,
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const currentDate = new Date();
  // Format the date in Danish, e.g., "1. februar 2025"
  const formattedDate = format(currentDate, "d. MMMM yyyy", { locale: da });

  // Calculate word count
  const wordCount = editedContent.trim() ? editedContent.trim().split(/\s+/).length : 0;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const handleSaveChanges = () => {
    if (onEdit) {
      onEdit(editedContent);
    }
    setIsEditing(false);
    toast({
      title: "Ændringer gemt",
      description: "Din ansøgning er blevet opdateret.",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    toast({
      title: "Kopieret til udklipsholder",
      description: "Ansøgningen er blevet kopieret til din udklipsholder.",
    });
  };

  // Function to create formatted letter content with header
  const getFormattedLetterContent = () => {
    const letterHeader = `${company || "Virksomhed"}\nAtt.: Ansøgning til ${jobTitle || "stillingen"}\n\n`;
    return letterHeader + editedContent;
  };

  // Function to download as text file
  const handleDownloadTxt = () => {
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
  };

  // Function to download as PDF
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF();
      const companyName = company || "Virksomhed";
      const jobTitleText = jobTitle || "stillingen";
      
      // Set font for the entire document
      doc.setFont("helvetica", "normal");
      
      // Add company and job title
      doc.setFontSize(12);
      doc.text(companyName, 20, 20);
      doc.text(`Att.: Ansøgning til ${jobTitleText}`, 20, 30);
      
      // Add date on the right
      const dateText = formattedDate;
      const dateWidth = doc.getStringUnitWidth(dateText) * 12 / doc.internal.scaleFactor;
      doc.text(dateText, doc.internal.pageSize.width - 20 - dateWidth, 30);
      
      // Add the content
      doc.setFontSize(11);
      
      // Split content by new lines and add line by line to handle word wrapping
      const contentLines = editedContent.split("\n");
      let yPosition = 50;
      const lineHeight = 7;
      
      contentLines.forEach(line => {
        // Use splitTextToSize to handle word wrapping (limit line width to 170 mm)
        const wrappedText = doc.splitTextToSize(line, 170);
        wrappedText.forEach(wrappedLine => {
          doc.text(wrappedLine, 20, yPosition);
          yPosition += lineHeight;
          
          // Add a new page if we're near the bottom
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
        });
        
        // Add space between paragraphs
        yPosition += 3;
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
  };

  // Function to download as Word document
  const handleDownloadDocx = () => {
    try {
      const companyName = company || "Virksomhed";
      const jobTitleText = jobTitle || "stillingen";
      
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
                text: `Att.: Ansøgning til ${jobTitleText}`,
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
              ...editedContent.split("\n\n").map(paragraph => 
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
  };

  const documentTitle = jobTitle && company
    ? `Ansøgning til ${jobTitle} hos ${company}`
    : "Ansøgningsforhåndsvisning";

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-0 truncate">
          {documentTitle}
        </h2>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Gem ændringer"
            >
              Gem ændringer
            </button>
          ) : (
            <>
              {isEditable && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  aria-label="Rediger ansøgning"
                  title="Rediger ansøgning"
                >
                  <Edit className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">Rediger</span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title="Kopier til udklipsholder"
                aria-label="Kopier til udklipsholder"
              >
                <Copy className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Kopier</span>
              </button>
              <button
                onClick={handleDownloadTxt}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title="Download som tekstfil"
                aria-label="Download som tekstfil"
              >
                <FileText className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Tekst</span>
              </button>
              <button
                onClick={handleDownloadDocx}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title="Download som Word-dokument"
                aria-label="Download som Word-dokument"
              >
                <File className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Word</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title="Download som PDF"
                aria-label="Download som PDF"
              >
                <FileIcon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="p-5">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={handleTextChange}
            className="w-full h-96 p-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 font-serif text-base transition-colors"
            aria-label="Rediger ansøgningstekst"
          />
        ) : (
          <div className="flex flex-col h-96 border border-gray-200 rounded-md p-6">
            <div className="flex justify-between mb-8">
              <div className="font-serif text-left">
                <p className="font-semibold">{company || "Virksomhed"}</p>
                <p>Att.: Ansøgning til {jobTitle || "stillingen"}</p>
              </div>
              <div className="font-serif text-right">
                <p>{formattedDate}</p>
              </div>
            </div>
            <div 
              className="prose max-w-none font-serif whitespace-pre-line text-base leading-relaxed overflow-auto flex-grow border border-gray-100 rounded p-4 shadow-inner text-left" 
              tabIndex={0} 
              aria-label="Ansøgningstekst"
            >
              {editedContent}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <p>
          {wordCount} {wordCount === 1 ? "ord" : "ord"}
        </p>
        <p>
          {/* You can add additional footer content here if needed */}
        </p>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
