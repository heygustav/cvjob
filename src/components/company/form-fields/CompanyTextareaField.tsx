
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanyTextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  isLoading?: boolean;
  rows?: number;
}

const CompanyTextareaField = React.memo(({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  isLoading = false,
  rows = 3
}: CompanyTextareaFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={isLoading}
        rows={rows}
        className="w-full resize-y"
      />
    </div>
  );
});

CompanyTextareaField.displayName = "CompanyTextareaField";

export default CompanyTextareaField;
