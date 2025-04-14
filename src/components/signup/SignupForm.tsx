
import React, { useState, useCallback } from "react";
import DOMPurify from "dompurify";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import TermsCheckbox from "./TermsCheckbox";
import SubmitButton from "./SubmitButton";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  gdpr: boolean;
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
    terms: false,
    gdpr: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : DOMPurify.sanitize(value),
    }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms || !formData.gdpr) {
      return; // Don't submit if terms or GDPR not accepted
    }
    onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <TextInput
        id="name"
        label="Fulde navn"
        type="text"
        autoComplete="name"
        placeholder="Anders Andersen"
        value={formData.name}
        onChange={handleChange}
      />

      <TextInput
        id="email"
        label="E-mailadresse"
        type="email"
        autoComplete="email"
        placeholder="dig@eksempel.dk"
        value={formData.email}
        onChange={handleChange}
      />

      <PasswordInput
        id="password"
        label="Adgangskode"
        value={formData.password}
        onChange={handleChange}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />

      <PasswordInput
        id="confirmPassword"
        label="Bekræft adgangskode"
        value={formData.confirmPassword}
        onChange={handleChange}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        isConfirmation={true}
        confirmationValue={formData.password}
      />

      <div onChange={handleChange}>
        <TermsCheckbox />
      </div>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm">
        <p className="text-blue-800">
          <strong>GDPR information:</strong> Vi behandler kun dine data for at levere vores tjenester. 
          Du kan til enhver tid se, rette eller slette alle dine personoplysninger via din profil.
          <a href="/gdpr-info" className="text-primary ml-1 font-medium hover:underline">Læs mere om GDPR</a>
        </p>
      </div>

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default React.memo(SignupForm);
