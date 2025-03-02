
import React from "react";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormDescription } from "@/components/ui/form";

interface UrlFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const UrlField: React.FC<UrlFieldProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="mb-5">
      <div>
        <label htmlFor="url" className="text-sm font-medium text-gray-700">
          Job-URL (Valgfri)
        </label>
        <Input
          type="url"
          id="url"
          name="url"
          value={value}
          onChange={onChange}
          className="w-full"
          placeholder="F.eks. https://eksempel.dk/jobs/marketingansvarlig"
          disabled={disabled}
          aria-describedby="url-description"
        />
        <p id="url-description" className="text-xs text-gray-400 italic">
          Indsæt linket til jobopslaget, hvis du har det
        </p>
      </div>
    </div>
  );
};

export default UrlField;
