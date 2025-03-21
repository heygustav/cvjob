/**
 * A simple utility function to generate UUIDs
 * This is a replacement for the uuid package to avoid Rollup issues
 */
export const generateUUID = (): string => {
  return crypto.randomUUID();
}; 