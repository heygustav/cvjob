
import { JobPosting, CoverLetter, User, Profile, Company } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";

/**
 * Type guard to check if a value is a JobPosting
 */
export function isJobPosting(value: unknown): value is JobPosting {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    'title' in value &&
    'company' in value &&
    'description' in value &&
    'user_id' in value
  );
}

/**
 * Type guard to check if a value is a CoverLetter
 */
export function isCoverLetter(value: unknown): value is CoverLetter {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    'content' in value &&
    'job_posting_id' in value &&
    'user_id' in value
  );
}

/**
 * Type guard to check if a value is a User
 */
export function isUser(value: unknown): value is User {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    'email' in value
  );
}

/**
 * Type guard to check if a value is a Profile
 */
export function isProfile(value: unknown): value is Profile {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value
  );
}

/**
 * Type guard to check if a value is a JobFormData
 */
export function isJobFormData(value: unknown): value is JobFormData {
  return (
    value !== null &&
    typeof value === 'object' &&
    'title' in value &&
    'company' in value &&
    'description' in value
  );
}

/**
 * Type guard to check if a value is a Company
 */
export function isCompany(value: unknown): value is Company {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    'name' in value &&
    'user_id' in value
  );
}

/**
 * Generic type guard for array of specific type
 */
export function isArrayOfType<T>(
  value: unknown,
  typeGuard: (item: unknown) => item is T
): value is T[] {
  return (
    Array.isArray(value) &&
    value.every(item => typeGuard(item))
  );
}

/**
 * Generic type guard for non-null value
 */
export function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type assertion function that throws an error if condition is not met
 */
export function assertType<T>(
  value: unknown,
  typeGuard: (value: unknown) => value is T,
  errorMessage = 'Type assertion failed'
): T {
  if (typeGuard(value)) {
    return value;
  }
  throw new Error(errorMessage);
}
