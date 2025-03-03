
import { useState } from 'react';
import { z } from 'zod';

// Define validation schemas
const emailSchema = z.string().email('Ugyldig email adresse');
const passwordSchema = z.string().min(8, 'Adgangskode skal være mindst 8 tegn');

export const useValidation = () => {
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const validateForm = (email: string, password: string): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    
    try {
      emailSchema.parse(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.email = error.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.password = error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateForm };
};
