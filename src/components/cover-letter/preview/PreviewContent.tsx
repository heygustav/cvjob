
import React from "react";
import DOMPurify from "dompurify";

interface PreviewContentProps {
  isEditing: boolean;
  editedContent: string;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  company?: string;
  jobTitle?: string;
  contactPerson?: string;
  formattedDate: string;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  isEditing,
  editedContent,
  onTextChange,
  company,
  jobTitle,
  contactPerson,
  formattedDate,
}) => {
  // Sanitize all user inputs to prevent XSS attacks
  const sanitizedCompany = company ? DOMPurify.sanitize(company) : "Virksomhed";
  const sanitizedJobTitle = jobTitle ? DOMPurify.sanitize(jobTitle) : "stillingen";
  const sanitizedContactPerson = contactPerson ? DOMPurify.sanitize(contactPerson) : "";
  const sanitizedContent = DOMPurify.sanitize(editedContent);

  return (
    <>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={onTextChange}
          className="w-full h-96 p-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 font-serif text-base transition-colors"
          aria-label="Rediger ansøgningstekst"
          placeholder="Skriv eller rediger din ansøgningstekst her..."
        />
      ) : (
        <div className="flex flex-col h-96 border border-gray-200 rounded-md p-6">
          <header className="flex justify-between mb-8">
            <div className="font-serif text-left">
              <p className="font-bold">{sanitizedCompany}</p>
              {/* Only render this line if contactPerson exists */}
              {sanitizedContactPerson && (
                <p className="font-bold">Att.: Rekrutteringsansvarlig {sanitizedContactPerson}</p>
              )}
              <p className="font-bold">Ansøgning til {sanitizedJobTitle}</p>
            </div>
            <div className="font-serif text-right">
              <p className="font-bold" aria-label="Dato for ansøgning">{formattedDate}</p>
            </div>
          </header>
          <article 
            className="prose max-w-none font-serif whitespace-pre-line text-base leading-snug overflow-auto flex-grow border border-gray-100 rounded p-4 shadow-inner text-left" 
            tabIndex={0} 
            aria-label="Ansøgningstekst"
            role="document"
            style={{ lineHeight: "1.0" }}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      )}
    </>
  );
};

export default PreviewContent;
