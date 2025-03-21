
import React from "react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { LinkIcon } from "lucide-react";

interface UrlFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const UrlField: React.FC<UrlFieldProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="mb-5">
      <div className="space-y-1">
        <FormLabel htmlFor="url" className="text-sm font-medium text-gray-700">
          Job-URL (Valgfri)
        </FormLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <Input
            type="url"
            id="url"
            name="url"
            value={value}
            onChange={onChange}
            className="w-full pl-10"
            placeholder="F.eks. https://eksempel.dk/jobs/marketingansvarlig"
            disabled={disabled}
            aria-describedby="url-description"
          />
        </div>
        <p id="url-description" className="text-xs text-gray-500 mt-1">
          Indsæt linket til jobopslaget, hvis du har det
        </p>
      </div>
    </div>
  );
};

export default UrlField;
