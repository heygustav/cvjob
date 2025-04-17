
import React, { useState } from 'react';
import { CoverLetter } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import PreviewHeader from './PreviewHeader';
import PreviewContent from './PreviewContent';
import PreviewFooter from './PreviewFooter';
import { useCoverLetterDocuments } from './hooks/useCoverLetterDocuments';

interface CoverLetterPreviewProps {
  letter: CoverLetter;
  content?: string;
  isEditable?: boolean;
  onEditContent?: (content: string) => Promise<void>;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ 
  letter, 
  content,
  isEditable = false,
  onEditContent
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content || letter.content);
  
  // Use the custom content if provided, otherwise use the letter's content
  const displayContent = content || letter.content;
  
  const {
    isDownloading,
    fileFormat,
    handleDownloadClick,
    handleFormatChange
  } = useCoverLetterDocuments(letter, displayContent);

  if (!user) {
    return <div>Log ind for at se din ansøgning</div>;
  }

  // Calculate word count
  const wordCount = displayContent ? displayContent.split(/\s+/).filter(word => word.length > 0).length : 0;

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(displayContent);
  };

  const handleSaveChanges = async () => {
    if (onEditContent) {
      await onEditContent(editedContent);
    }
    setIsEditing(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(displayContent)
      .then(() => {
        alert('Ansøgningstekst kopieret til udklipsholder');
      })
      .catch(err => {
        console.error('Kunne ikke kopiere tekst: ', err);
      });
  };

  // Extract job information from the letter's associated job (if available)
  const jobTitle = letter.job_title || "Stilling";
  const company = letter.company || "Virksomhed";
  const contactPerson = letter.contact_person || "";

  return (
    <div className="w-full h-full flex flex-col">
      <PreviewHeader 
        documentTitle={`Ansøgning: ${jobTitle} - ${company}`}
        isEditing={isEditing}
        isEditable={isEditable}
        onSaveChanges={handleSaveChanges}
        onEdit={handleEditClick}
        onCopy={handleCopyToClipboard}
        isDownloading={isDownloading}
        fileFormat={fileFormat}
        onDownload={handleDownloadClick}
        onFormatChange={handleFormatChange}
        className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      />
      
      <div className="flex-1 overflow-auto p-3 sm:p-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <PreviewContent 
            content={displayContent}
            isEditing={isEditing}
            editedContent={editedContent}
            onTextChange={(e) => setEditedContent(e.target.value)}
            company={company}
            jobTitle={jobTitle}
            contactPerson={contactPerson}
            formattedDate={new Date().toLocaleDateString('da-DK')}
            className="text-sm sm:text-base"
          />
        </div>
      </div>
      
      <PreviewFooter 
        wordCount={wordCount} 
        className="sticky bottom-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      />
    </div>
  );
};

export default CoverLetterPreview;
