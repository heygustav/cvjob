
import React from "react";

interface JobDescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  onExtract: () => void;
  isExtracting: boolean;
  error?: string;
}

const JobDescriptionField: React.FC<JobDescriptionFieldProps> = ({
  value,
  onChange,
  disabled,
  onExtract,
  isExtracting,
  error,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Jobbeskrivelse <span className="text-rose-500">*</span>
        </label>
        <button
          type="button"
          onClick={onExtract}
          disabled={disabled || isExtracting || !value}
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
      <div className="mt-1 relative">
        <textarea
          id="description"
          name="description"
          rows={10}
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
      </div>
    </div>
  );
};

export default JobDescriptionField;
