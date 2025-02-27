
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Download, Copy, Save, Edit } from "lucide-react";

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

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    toast({
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt.",
    });
  };

  // Function to simulate file download
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editedContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Ansøgning - ${company || "Virksomhed"} - ${
      jobTitle || "Stilling"
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download startet",
      description: "Din ansøgning bliver downloadet.",
    });
  };

  const documentTitle = jobTitle && company
    ? `Ansøgning til ${jobTitle} hos ${company}`
    : "Ansøgningsforhåndsvisning";

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-0 truncate">
          {documentTitle}
        </h2>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Gem ændringer"
            >
              Gem ændringer
            </button>
          ) : (
            <>
              {isEditable && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  aria-label="Rediger ansøgning"
                  title="Rediger ansøgning"
                >
                  <Edit className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">Rediger</span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title="Kopier til udklipsholder"
                aria-label="Kopier til udklipsholder"
              >
                <Copy className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Kopier</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title="Download som tekstfil"
                aria-label="Download som tekstfil"
              >
                <Download className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Download</span>
              </button>
              {onSave && (
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  title="Gem til din konto"
                  aria-label="Gem til din konto"
                >
                  <Save className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">Gem</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="p-5">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={handleTextChange}
            className="w-full h-96 p-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 font-serif text-base transition-colors"
            aria-label="Rediger ansøgningstekst"
          />
        ) : (
          <div 
            className="prose max-w-none font-serif whitespace-pre-line text-base leading-relaxed overflow-auto h-96 p-4 bg-gray-50 rounded-md" 
            tabIndex={0} 
            aria-label="Ansøgningstekst"
          >
            {editedContent}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <p>
          {new Date().toLocaleDateString("da-DK")}
        </p>
        <p>
          {/* JobMagic reference removed */}
        </p>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
