
import React, { useState } from 'react';
import { PersonalInfoFormState } from '@/pages/Profile';
import ErrorDisplay from '@/components/ErrorDisplay';
import FileDropArea from './FileDropArea';
import ResumeHelp from './ResumeHelp';
import ResumeProgress from './ResumeProgress';
import ResumeProcessor from './ResumeProcessor';

interface ResumeUploaderProps {
  onExtractedData: (data: Partial<PersonalInfoFormState>) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onExtractedData }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup the processor with all necessary callbacks
  // Changed from JSX component usage to hook usage
  const { processFile } = ResumeProcessor({
    onExtractedData,
    onProcessingStart: () => {
      setIsExtracting(true);
      setError(null);
    },
    onProcessingEnd: (errorMessage) => {
      setIsExtracting(false);
      if (errorMessage) setError(errorMessage);
    }
  });

  const handleFileSelected = (file: File) => {
    if (isExtracting) return;
    processFile(file);
  };

  const retryUpload = () => {
    console.log("Retrying upload, resetting error state");
    setError(null);
    
    // Check if PDF.js worker is available after a short delay
    setTimeout(async () => {
      try {
        const workerCheck = await fetch('/pdf.worker.js', { method: 'HEAD' });
        if (workerCheck.ok) {
          console.log("PDF worker is now available");
        }
      } catch (error) {
        console.error("Error checking PDF worker availability:", error);
      }
    }, 1000);
  };

  return (
    <div className="mb-6 w-full">
      <p className="sm:col-span-3">
        Upload CV (PDF eller DOCX)
      </p>
      
      <FileDropArea 
        onFileSelected={handleFileSelected}
        isProcessing={isExtracting}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      
      <ResumeProgress isExtracting={isExtracting} />
      <ResumeHelp />
      
      {error && (
        <ErrorDisplay
          title="Information om CV-upload"
          message={error}
          onRetry={retryUpload}
          phase="cv-parsing"
        />
      )}
    </div>
  );
};

export default ResumeUploader;
