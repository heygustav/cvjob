
import React from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import { FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFieldsProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ formData, handleChange }) => {
  // Simple form validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() === "" || emailRegex.test(email);
  };

  const isEmailValid = validateEmail(formData.email);

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
              className={`mt-1 block w-full ${!formData.name.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              data-testid="profile-name-input"
              aria-required="true"
              aria-invalid={!formData.name.trim()}
            />
          </FormControl>
          {!formData.name.trim() && (
            <p className="mt-1 text-sm text-red-600" id="name-error">
              Navn er påkrævet
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
              className={`mt-1 block w-full ${!isEmailValid ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              data-testid="profile-email-input"
              aria-required="true"
              aria-invalid={!isEmailValid}
            />
          </FormControl>
          {!isEmailValid && (
            <p className="mt-1 text-sm text-red-600" id="email-error">
              Indtast venligst en gyldig email adresse
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
