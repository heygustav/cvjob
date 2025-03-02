
import React, { DragEvent, useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileDropAreaProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const FileDropArea: React.FC<FileDropAreaProps> = ({
  onFileSelected,
  isProcessing,
  isDragging,
  setIsDragging
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      onFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const handleClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`p-4 border-2 border-dashed ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50'} rounded-lg text-center transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="py-4">
        <Upload className={`h-10 w-10 mx-auto ${isDragging ? 'text-primary' : 'text-gray-400'} mb-3 transition-colors`} />
        <h3 className="text-sm font-medium text-gray-900 mb-1">Upload dit CV</h3>
        <p className="text-xs text-gray-500 mb-4 italic">
          {isDragging 
            ? "Slip filen for at uploade..." 
            : "Træk og slip din CV-fil her, eller klik for at vælge"}
        </p>
        
        {isProcessing ? (
          <ProcessingIndicator />
        ) : (
          <div className="text-xs text-gray-500">
            Accepterer PDF og DOCX filer (max 2MB)
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

const ProcessingIndicator: React.FC = () => (
  <div className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-primary">
    <svg
      className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    Behandler fil...
  </div>
);

export default FileDropArea;
