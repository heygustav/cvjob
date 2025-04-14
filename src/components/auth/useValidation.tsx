
import { useFormValidation, commonSchemas } from '@/hooks/useFormValidation';
import { z } from 'zod';

const authSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password
});

export const useValidation = () => {
  const { errors, validateForm } = useFormValidation<{
    email: string;
    password: string;
  }>(authSchema);

  return {
    errors,
    validateForm: (email: string, password: string) =>
      validateForm({ email, password })
  };
};

