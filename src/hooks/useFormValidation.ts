
import { useState } from "react";
import { z } from "zod";
import { useToast } from "./use-toast";

export type ValidationSchema = z.ZodType<any>;
export type ValidationErrors = Record<string, string>;

export function useFormValidation<T extends Record<string, any>>(schema: ValidationSchema) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { toast } = useToast();

  const validateForm = (formData: T): boolean => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        
        // Show toast with first error
        toast({
          title: "Validering fejlede",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const clearFieldError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateForm,
    clearFieldError,
    clearAllErrors
  };
}

// Predefinerede validation schemas som kan genbruges
export const commonSchemas = {
  email: z.string().email('Ugyldig email adresse'),
  password: z.string().min(8, 'Adgangskode skal være mindst 8 tegn'),
  name: z.string().min(1, 'Navn er påkrævet'),
  phone: z.string().regex(/^\d+$/, 'Telefonnummer skal kun indeholde tal'),
  website: z.string().url('Ugyldig URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Beskrivelse skal være mindst 10 tegn lang'),
};

