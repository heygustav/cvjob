
import { useFormValidation, commonSchemas } from '@/hooks/useFormValidation';
import { z } from 'zod';
import type { ProfileState } from './types';

const profileSchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email,
  phone: commonSchemas.phone.optional(),
  address: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  summary: z.string().optional(),
});

export const useProfileValidation = () => {
  const { errors: validationErrors, validateForm, clearFieldError } = 
    useFormValidation<ProfileState>(profileSchema);

  return {
    validationErrors,
    validateForm,
    clearFieldError
  };
};

