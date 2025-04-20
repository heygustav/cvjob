
import { useState, useCallback } from "react";
import { z } from "zod";
import { useToast } from "./use-toast";

export type ValidationSchema = z.ZodType<any>;
export type ValidationErrors = Record<string, string>;

export function useFormValidation<T extends Record<string, any>>(schema: ValidationSchema) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const validateField = useCallback((name: string, value: any) => {
    try {
      // Create a partial schema for the specific field
      // Since we can't access schema.shape directly, we'll use a different approach
      const partialObject = { [name]: value };
      const partialSchema = z.object({ [name]: schema }).partial();
      partialSchema.parse(partialObject);
      
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === name);
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [name]: fieldError.message
          }));
        }
      }
      return false;
    }
  }, [schema]);

  const handleBlur = useCallback((fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  }, []);

  const validateForm = useCallback((formData: T): boolean => {
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
  }, [schema, toast]);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
    setTouchedFields(new Set());
  }, []);

  return {
    errors,
    touchedFields,
    validateForm,
    validateField,
    clearFieldError,
    clearAllErrors,
    handleBlur,
    isFieldTouched: (fieldName: string) => touchedFields.has(fieldName)
  };
}

// Predefined validation schemas
export const commonSchemas = {
  email: z.string().email('Ugyldig email adresse'),
  password: z.string().min(8, 'Adgangskode skal være mindst 8 tegn'),
  name: z.string().min(1, 'Navn er påkrævet'),
  phone: z.string().regex(/^\d+$/, 'Telefonnummer skal kun indeholde tal'),
  website: z.string().url('Ugyldig URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Beskrivelse skal være mindst 10 tegn lang'),
};
