
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Download, Copy, Save } from "lucide-react";

interface CoverLetterPreviewProps {
  content: string;
  jobTitle?: string;
  company?: string;
  onEdit?: (content: string) => void;
  onSave?: () => void;
  isEditable?: boolean;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  content,
  jobTitle,
  company,
  onEdit,
  onSave,
  isEditable = true,
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const handleSaveChanges = () => {
    if (onEdit) {
      onEdit(editedContent);
    }
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your cover letter has been updated.",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    toast({
      title: "Copied to clipboard",
      description: "The cover letter has been copied to your clipboard.",
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    toast({
      title: "Cover letter saved",
      description: "Your cover letter has been saved successfully.",
    });
  };

  // Function to simulate file download
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editedContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Cover Letter - ${company || "Company"} - ${
      jobTitle || "Position"
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download started",
      description: "Your cover letter is being downloaded.",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">
          {jobTitle && company
            ? `Cover Letter for ${jobTitle} at ${company}`
            : "Cover Letter Preview"}
        </h3>
        <div className="flex space-x-2">
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Save Changes
            </button>
          ) : (
            <>
              {isEditable && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                title="Download as text file"
              >
                <Download className="h-4 w-4" />
              </button>
              {onSave && (
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  title="Save to your account"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="p-4">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={handleTextChange}
            className="w-full h-96 p-4 border border-gray-300 rounded-md focus:border-black focus:ring-black font-serif text-base"
          />
        ) : (
          <div className="prose max-w-none font-serif whitespace-pre-line">
            {editedContent}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        <p>
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p>
          Created with JobMagic
        </p>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
