
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}) => {
  return (
    <div>
      <Label htmlFor={id} className="block mb-1.5">
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};

export default TextInput;
