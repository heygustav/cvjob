
import { useFormValidation, commonSchemas } from '@/hooks/useFormValidation';
import { z } from 'zod';

const signupSchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email,
  password: commonSchemas.password,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Adgangskoderne stemmer ikke overens",
  path: ["confirmPassword"],
});

export const useSignupValidation = () => {
  const { validateForm, errors } = useFormValidation<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>(signupSchema);

  return {
    validateForm,
    errors
  };
};

