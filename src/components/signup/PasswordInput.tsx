
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  isConfirmation?: boolean;
  confirmationValue?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  togglePasswordVisibility,
  isConfirmation = false,
  confirmationValue,
}) => {
  return (
    <div>
      <Label htmlFor={id} className="block mb-1.5">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          autoComplete={isConfirmation ? "new-password" : "new-password"}
          required
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full pr-10"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>
      {!isConfirmation && value && <PasswordStrengthIndicator password={value} />}
      {isConfirmation && value && confirmationValue && (
        <p
          className={`mt-2 text-xs ${
            value === confirmationValue ? "text-green-600" : "text-red-600"
          }`}
        >
          {value === confirmationValue
            ? "Adgangskoderne stemmer overens"
            : "Adgangskoderne stemmer ikke overens"}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
