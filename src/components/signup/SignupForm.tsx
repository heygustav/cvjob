
import React, { useState } from "react";
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

      <TermsCheckbox />

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default SignupForm;
