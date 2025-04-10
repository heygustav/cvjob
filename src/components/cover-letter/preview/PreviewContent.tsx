
import React from "react";

interface PreviewContentProps {
  content: string;
  isEditing?: boolean;
  editedContent?: string;
  onTextChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  company?: string;
  jobTitle?: string;
  contactPerson?: string;
  formattedDate: string;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  content,
  isEditing = false,
  editedContent = "",
  onTextChange = () => {},
  company = "Virksomhed",
  jobTitle = "Stilling",
  contactPerson = "",
  formattedDate
}) => {
  // Format the content to display properly with line breaks
  const formattedContent = () => {
    return { __html: content.replace(/\n/g, '<br />') };
  };

  if (isEditing) {
    return (
      <div className="relative mt-4">
        <textarea
          className="w-full min-h-[500px] p-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          value={editedContent}
          onChange={onTextChange}
        />
      </div>
    );
  }

  return (
    <div className="letter-container space-y-6">
      <div className="letter-header space-y-1 mb-8">
        <div className="text-right">{formattedDate}</div>
      </div>

      {contactPerson && (
        <div className="greeting">
          <p>Kære {contactPerson},</p>
        </div>
      )}

      <div className="letter-body prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={formattedContent()} />
      </div>
    </div>
  );
};

export default PreviewContent;
