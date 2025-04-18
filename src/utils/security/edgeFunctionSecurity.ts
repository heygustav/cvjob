
import DOMPurify from "dompurify";

export const sanitizeEdgeFunctionPayload = <T>(payload: T): T => {
  if (typeof payload === 'string') {
    return DOMPurify.sanitize(payload) as T;
  }
  if (typeof payload === 'object' && payload !== null) {
    return Object.entries(payload).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: typeof value === 'string' ? DOMPurify.sanitize(value) : value
    }), {}) as T;
  }
  return payload;
};

export const validateEdgeFunctionResponse = <T>(response: T): T => {
  if (!response) {
    throw new Error('Invalid response from edge function');
  }
  return response;
};

export const getSafeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
