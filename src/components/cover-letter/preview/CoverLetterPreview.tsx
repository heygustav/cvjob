
import React from 'react';
import { CoverLetter } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import PreviewHeader from './PreviewHeader';
import PreviewContent from './PreviewContent';
import PreviewFooter from './PreviewFooter';
import { useCoverLetterDocuments } from './hooks/useCoverLetterDocuments';

interface CoverLetterPreviewProps {
  letter: CoverLetter;
  content?: string; // Allow passing custom content for preview
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ letter, content }) => {
  const { user } = useAuth();
  
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

  return (
    <div className="w-full h-full flex flex-col">
      <PreviewHeader 
        isDownloading={isDownloading}
        fileFormat={fileFormat}
        onDownload={handleDownloadClick}
        onFormatChange={handleFormatChange}
      />
      
      <div className="flex-1 overflow-auto p-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <PreviewContent content={displayContent} />
        </div>
      </div>
      
      <PreviewFooter />
    </div>
  );
};

export default CoverLetterPreview;
