
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PreviewHeader from "./PreviewHeader";
import PreviewContent from "./PreviewContent";
import PreviewFooter from "./PreviewFooter";
import { cleanCoverLetterContent } from "./utils/contentCleaner";
import { useCoverLetterDocuments } from "./hooks/useCoverLetterDocuments";

interface CoverLetterPreviewProps {
  content: string;
  jobTitle?: string;
  company?: string;
  contactPerson?: string;
  onEdit?: (content: string) => Promise<void> | void;
  isEditable?: boolean;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  content,
  jobTitle,
  company,
  contactPerson, // Use the contactPerson prop
  onEdit,
  isEditable = true,
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Apply content cleaning when component renders
  useState(() => {
    const cleanedContent = cleanCoverLetterContent(content, company, jobTitle);
    setEditedContent(cleanedContent);
  });

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

  // Use our custom hook for document generation
  const { 
    handleDownloadTxt, 
    handleDownloadPdf, 
    handleDownloadDocx,
    formattedDate
  } = useCoverLetterDocuments(editedContent, company, jobTitle);

  const documentTitle = jobTitle && company
    ? `Ansøgning til ${jobTitle} hos ${company}`
    : "Ansøgningsforhåndsvisning";

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <PreviewHeader 
        documentTitle={documentTitle}
        isEditing={isEditing}
        isEditable={isEditable}
        onSaveChanges={handleSaveChanges}
        onEdit={() => setIsEditing(true)}
        onCopy={handleCopy}
        onDownloadTxt={handleDownloadTxt}
        onDownloadDocx={handleDownloadDocx}
        onDownloadPdf={handleDownloadPdf}
      />
      
      <div className="p-5">
        <PreviewContent 
          isEditing={isEditing}
          editedContent={editedContent}
          onTextChange={handleTextChange}
          company={company}
          jobTitle={jobTitle}
          contactPerson={contactPerson}
          formattedDate={formattedDate}
        />
      </div>
      
      <PreviewFooter wordCount={wordCount} />
    </div>
  );
};

export default CoverLetterPreview;
