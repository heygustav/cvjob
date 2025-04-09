
import React, { useState } from 'react';
import { CoverLetter } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import PreviewHeader from './PreviewHeader';
import PreviewContent from './PreviewContent';
import PreviewFooter from './PreviewFooter';
import { useCoverLetterDocuments } from './hooks/useCoverLetterDocuments';

interface CoverLetterPreviewProps {
  letter: CoverLetter;
  content?: string; // Allow passing custom content for preview
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

  return (
    <div className="w-full h-full flex flex-col">
      <PreviewHeader 
        documentTitle={`Ansøgning: ${letter.job_title || 'Stilling'} - ${letter.company || 'Virksomhed'}`}
        isEditing={isEditing}
        isEditable={isEditable}
        onSaveChanges={handleSaveChanges}
        onEdit={handleEditClick}
        onCopy={handleCopyToClipboard}
        onDownloadTxt={() => {/* Implement download txt */}}
        onDownloadDocx={() => {/* Implement download docx */}}
        onDownloadPdf={() => {/* Implement download pdf */}}
        isDownloading={isDownloading}
        fileFormat={fileFormat}
        onDownload={handleDownloadClick}
        onFormatChange={handleFormatChange}
      />
      
      <div className="flex-1 overflow-auto p-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <PreviewContent 
            content={displayContent}
            isEditing={isEditing}
            editedContent={editedContent}
            onTextChange={(e) => setEditedContent(e.target.value)}
            company={letter.company}
            jobTitle={letter.job_title}
            contactPerson={letter.contact_person}
            formattedDate={new Date().toLocaleDateString('da-DK')}
          />
        </div>
      </div>
      
      <PreviewFooter wordCount={wordCount} />
    </div>
  );
};

export default CoverLetterPreview;
