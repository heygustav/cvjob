
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import DOMPurify from "dompurify";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  onSubmit: (formData: SignupFormData) => void;
  isLoading: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: DOMPurify.sanitize(value),
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name" className="block mb-1.5">
          Fulde navn
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Anders Andersen"
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="email" className="block mb-1.5">
          E-mailadresse
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="dig@eksempel.dk"
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="password" className="block mb-1.5">
          Adgangskode
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
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
        {formData.password && (
          <PasswordStrengthIndicator password={formData.password} />
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="block mb-1.5">
          Bekræft adgangskode
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full"
        />
        {formData.password && formData.confirmPassword && (
          <p
            className={`mt-2 text-xs ${
              formData.password === formData.confirmPassword
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formData.password === formData.confirmPassword
              ? "Adgangskoderne stemmer overens"
              : "Adgangskoderne stemmer ikke overens"}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          Jeg accepterer{" "}
          <a href="#" className="font-medium text-primary hover:text-primary-800">
            Brugsbetingelserne
          </a>{" "}
          og{" "}
          <a href="#" className="font-medium text-primary hover:text-primary-800">
            Privatlivspolitikken
          </a>
        </label>
      </div>

      <div>
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Opretter konto...
            </span>
          ) : (
            <span className="flex items-center">
              Opret konto
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
