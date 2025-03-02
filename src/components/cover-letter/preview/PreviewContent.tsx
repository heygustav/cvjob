
import React from "react";

interface PreviewContentProps {
  isEditing: boolean;
  editedContent: string;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  company?: string;
  jobTitle?: string;
  formattedDate: string;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  isEditing,
  editedContent,
  onTextChange,
  company,
  jobTitle,
  formattedDate,
}) => {
  return (
    <>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={onTextChange}
          className="w-full h-96 p-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 font-serif text-base transition-colors"
          aria-label="Rediger ansøgningstekst"
        />
      ) : (
        <div className="flex flex-col h-96 border border-gray-200 rounded-md p-6">
          <div className="flex justify-between mb-8">
            <div className="font-serif text-left">
              <p className="font-bold">{company || "Virksomhed"}</p>
              <p className="font-bold">Att.: Ansøgning til {jobTitle || "stillingen"}</p>
            </div>
            <div className="font-serif text-right">
              <p className="font-bold">{formattedDate}</p>
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
    </>
  );
};

export default PreviewContent;
