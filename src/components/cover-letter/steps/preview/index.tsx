
import React, { useState, useEffect } from "react";
import { CoverLetter } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import CoverLetterPreview from "../../preview/CoverLetterPreview";
import useKeywords from "./useKeywords";

interface PreviewStepProps {
  generatedLetter: CoverLetter;
  onEdit: (updatedContent: string) => Promise<void>;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  generatedLetter,
  onEdit,
}) => {
  const [letterContent, setLetterContent] = useState(generatedLetter.content);
  const [isEditing, setIsEditing] = useState(false);
  const { savedKeywords, insertKeyword, removeKeyword } = useKeywords();

  const handleSubmit = async () => {
    try {
      await onEdit(letterContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating letter:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 text-left">
      {isEditing ? (
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="letter-content" className="block text-sm font-medium text-gray-700">
              Rediger ansøgningstekst
            </label>
            <textarea
              id="letter-content"
              rows={20}
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          {savedKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Gemte nøgleord:</h4>
              <div className="flex flex-wrap gap-2">
                {savedKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => insertKeyword(keyword, setLetterContent)}
                    >
                      {keyword}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeKeyword(keyword);
                        }}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Klik på et nøgleord for at indsætte det ved markøren</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Annuller
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Gem ændringer
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Din ansøgning er genereret
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Rediger tekst
            </button>
          </div>

          {savedKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Gemte nøgleord:</h4>
              <div className="flex flex-wrap gap-2">
                {savedKeywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="px-2 py-1"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rediger ansøgningen for at indsætte nøgleord
              </p>
            </div>
          )}
        </div>
      )}

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <CoverLetterPreview
          letter={generatedLetter}
          content={letterContent}
        />
      </div>
    </div>
  );
};

export default PreviewStep;
