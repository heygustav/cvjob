
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
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Jobbeskrivelse
      </label>
      <textarea
        id="description"
        name="description"
        rows={8}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-md ${
          error ? 'border-red-300 ring-red-500' : 'border-gray-300'
        } shadow-sm focus:border-black focus:ring-black sm:text-sm`}
        placeholder="Indsæt jobbeskrivelsen her..."
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      <div className="mt-2">
        <button
          type="button"
          onClick={onExtract}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
          disabled={!value || disabled || isExtracting}
        >
          {isExtracting ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-gray-800" />
              Analyserer...
            </>
          ) : (
            "Hent information"
          )}
        </button>
        <p className="mt-1 text-xs text-gray-500">
          Indsæt hele jobopslaget, og lad os udtrække nøgleinformation automatisk
        </p>
      </div>
    </div>
  );
};

export default JobDescriptionField;
