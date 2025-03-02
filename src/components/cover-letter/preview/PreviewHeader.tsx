
import React from "react";
import { Copy, Edit, FileText, File, FileIcon } from "lucide-react";

interface PreviewHeaderProps {
  documentTitle: string;
  isEditing: boolean;
  isEditable: boolean;
  onSaveChanges: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onDownloadDocx: () => void;
  onDownloadPdf: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  documentTitle,
  isEditing,
  isEditable,
  onSaveChanges,
  onEdit,
  onCopy,
  onDownloadTxt,
  onDownloadDocx,
  onDownloadPdf,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
      <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-0 truncate">
        {documentTitle}
      </h2>
      <div className="flex flex-wrap gap-2">
        {isEditing ? (
          <button
            onClick={onSaveChanges}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-0 transition-colors"
            aria-label="Gem ændringer"
          >
            Gem ændringer
          </button>
        ) : (
          <>
            {isEditable && (
              <button
                onClick={onEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0 transition-colors"
                aria-label="Rediger ansøgning"
                title="Rediger ansøgning"
              >
                <Edit className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Rediger</span>
              </button>
            )}
            <button
              onClick={onCopy}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0 transition-colors"
              title="Kopier til udklipsholder"
              aria-label="Kopier til udklipsholder"
            >
              <Copy className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Kopier</span>
            </button>
            <button
              onClick={onDownloadTxt}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0 transition-colors"
              title="Download som tekstfil"
              aria-label="Download som tekstfil"
            >
              <FileText className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Tekst</span>
            </button>
            <button
              onClick={onDownloadDocx}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0 transition-colors"
              title="Download som Word-dokument"
              aria-label="Download som Word-dokument"
            >
              <File className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Word</span>
            </button>
            <button
              onClick={onDownloadPdf}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0 transition-colors"
              title="Download som PDF"
              aria-label="Download som PDF"
            >
              <FileIcon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewHeader;
