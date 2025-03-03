
import React from "react";
import { Check } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const passwordStrength = () => {
    if (!password) return 0;
    if (password.length < 8) return 1;
    if (/^[a-zA-Z0-9]*$/.test(password)) return 2;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 4;
    return 3;
  };

  const getPasswordStrengthText = () => {
    const strength = passwordStrength();
    if (strength === 0) return "";
    if (strength === 1) return "Svag";
    if (strength === 2) return "Rimelig";
    if (strength === 3) return "God";
    return "Stærk";
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-green-400";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
            style={{ width: `${passwordStrength() * 25}%` }}
          ></div>
        </div>
        <span className="text-xs ml-2 text-gray-600 min-w-[50px]">
          {getPasswordStrengthText()}
        </span>
      </div>
      <ul className="space-y-1 text-xs text-gray-500">
        <li className="flex items-center">
          <Check
            className={`h-3 w-3 mr-1 ${
              password.length >= 8 ? "text-green-500" : "text-gray-400"
            }`}
          />
          Mindst 8 tegn
        </li>
        <li className="flex items-center">
          <Check
            className={`h-3 w-3 mr-1 ${
              /[A-Z]/.test(password) ? "text-green-500" : "text-gray-400"
            }`}
          />
          Mindst et stort bogstav
        </li>
        <li className="flex items-center">
          <Check
            className={`h-3 w-3 mr-1 ${
              /[0-9]/.test(password) ? "text-green-500" : "text-gray-400"
            }`}
          />
          Mindst et tal
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
