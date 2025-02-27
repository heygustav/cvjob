
import React from "react";

interface UrlFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const UrlField: React.FC<UrlFieldProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="mb-5">
      <label
        htmlFor="url"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Job-URL (Valgfri)
      </label>
      <div className="relative">
        <input
          type="url"
          id="url"
          name="url"
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          placeholder="F.eks. https://eksempel.dk/jobs/marketingansvarlig"
          disabled={disabled}
          aria-describedby="url-description"
        />
      </div>
      <p id="url-description" className="mt-1 text-xs text-gray-500">
        Indsæt linket til jobopslaget, hvis du har det
      </p>
    </div>
  );
};

export default UrlField;
