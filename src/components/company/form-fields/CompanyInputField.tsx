
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CompanyInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  isLoading?: boolean;
}

const CompanyInputField = React.memo(({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  isLoading = false
}: CompanyInputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={isLoading}
        className="w-full"
      />
    </div>
  );
});

CompanyInputField.displayName = "CompanyInputField";

export default CompanyInputField;
