
import React, { useState, useEffect } from "react";
import { getDanishKeywords } from "@/services/keywords";
import { Badge } from "@/components/ui/badge";

interface JobDescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  onExtract: () => void;
  isExtracting: boolean;
  error?: string;
  onKeywordClick?: (keyword: string) => void;
}

const JobDescriptionField: React.FC<JobDescriptionFieldProps> = ({
  value,
  onChange,
  disabled,
  onExtract,
  isExtracting,
  error,
  onKeywordClick
}) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);

  // Extract keywords when job description has enough content
  useEffect(() => {
    const extractKeywords = async () => {
      if (value && value.length > 150 && !isLoadingKeywords) {
        setIsLoadingKeywords(true);
        try {
          const extractedKeywords = await getDanishKeywords(value);
          setKeywords(extractedKeywords);
        } catch (error) {
          console.error("Failed to extract keywords:", error);
        } finally {
          setIsLoadingKeywords(false);
        }
      }
    };

    const timer = setTimeout(extractKeywords, 1000);
    return () => clearTimeout(timer);
  }, [value]);

  const handleKeywordClick = (keyword: string) => {
    if (onKeywordClick) {
      onKeywordClick(keyword);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-1 gap-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Jobbeskrivelse <span className="text-rose-500">*</span>
        </label>
      </div>
      <div className="mt-1 relative">
        <textarea
          id="description"
          name="description"
          rows={8}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full rounded-md shadow-sm sm:text-sm placeholder:text-gray-400 ${
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-black focus:ring-black"
          }`}
          placeholder="Indsæt hele jobbeskrivelsen her. Jo mere komplet beskrivelsen er, desto bedre bliver din ansøgning."
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "description-error" : "description-description"}
        ></textarea>
        
        <div className="mt-2 flex justify-between items-center flex-wrap">
          <button
            type="button"
            onClick={onExtract}
            disabled={disabled || isExtracting || !value}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Forsøg at udfylde jobinformation automatisk fra beskrivelsen"
          >
            {isExtracting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-700"
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
                Udtrækker...
              </span>
            ) : (
              "Udtræk information"
            )}
          </button>
          
          {isLoadingKeywords && (
            <span className="text-xs text-gray-500 flex items-center ml-2">
              <svg
                className="animate-spin mr-1 h-3 w-3 text-gray-500"
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
              Analyserer nøgleord...
            </span>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id="description-error">
            {error}
          </p>
        )}
        <p 
          id="description-description" 
          className={`mt-1 text-xs ${error ? "text-red-500" : "text-gray-400 italic"}`}
        >
          Kopier og indsæt hele jobopslaget. Systemet vil forsøge at udtrække nøgleinformation automatisk.
        </p>

        {keywords.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Relevante søgeord:</h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-100 transition-colors px-2 py-1"
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Klik på et nøgleord for at bruge det i din ansøgning</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionField;
