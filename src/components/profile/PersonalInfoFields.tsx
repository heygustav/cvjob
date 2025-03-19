
import React from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import { FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFieldsProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  validationErrors?: Record<string, string>;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ 
  formData, 
  handleChange, 
  validationErrors = {} 
}) => {
  // Simple form validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() === "" || emailRegex.test(email);
  };

  const isEmailValid = validateEmail(formData.email);
  const hasNameError = !formData.name.trim() || !!validationErrors.name;
  const hasEmailError = !isEmailValid || !!validationErrors.email;

  // For cross-browser testing
  React.useEffect(() => {
    console.log("PersonalInfoFields rendered in browser:", navigator.userAgent);
    console.log("Viewport size:", window.innerWidth, "x", window.innerHeight);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      <div className="sm:col-span-3">
        <div className="form-group">
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Navn <span className="text-red-500">*</span>
          </Label>
          <FormControl>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`mt-1 block w-full ${hasNameError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              data-testid="profile-name-input"
              aria-required="true"
              aria-invalid={hasNameError}
              aria-describedby={hasNameError ? "name-error" : undefined}
            />
          </FormControl>
          {hasNameError && (
            <p className="mt-1 text-sm text-red-600" id="name-error">
              {validationErrors.name || "Navn er påkrævet"}
            </p>
          )}
        </div>
      </div>

      <div className="sm:col-span-3">
        <div className="form-group">
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </Label>
          <FormControl>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`mt-1 block w-full ${hasEmailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              data-testid="profile-email-input"
              aria-required="true"
              aria-invalid={hasEmailError}
              aria-describedby={hasEmailError ? "email-error" : undefined}
            />
          </FormControl>
          {hasEmailError && (
            <p className="mt-1 text-sm text-red-600" id="email-error">
              {validationErrors.email || "Indtast venligst en gyldig email adresse"}
            </p>
          )}
        </div>
      </div>

      <div className="sm:col-span-3">
        <div className="form-group">
          <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefon
          </Label>
          <FormControl>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full"
              data-testid="profile-phone-input"
              placeholder="f.eks. 12345678"
              inputMode="tel"
            />
          </FormControl>
        </div>
      </div>

      <div className="sm:col-span-3">
        <div className="form-group">
          <Label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adresse
          </Label>
          <FormControl>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full"
              data-testid="profile-address-input"
              placeholder="f.eks. Gadenavn 123, 1234 By"
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoFields;
