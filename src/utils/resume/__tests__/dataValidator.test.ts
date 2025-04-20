
import { describe, it, expect } from 'vitest';
import { validateExtractedData } from '../dataValidator';
import { RawResumeData } from '../types';

describe('validateExtractedData', () => {
  it('validates and sanitizes email correctly', () => {
    const rawData: RawResumeData = {
      email: 'test@example.com',
      name: 'Test User'
    };

    const result = validateExtractedData(rawData);
    expect(result.email).toBe('test@example.com');
  });

  it('rejects invalid email', () => {
    const rawData: RawResumeData = {
      email: 'invalid-email',
      name: 'Test User'
    };

    const result = validateExtractedData(rawData);
    expect(result.email).toBeUndefined();
  });

  it('validates phone numbers correctly', () => {
    const rawData: RawResumeData = {
      phone: '12345678',
      name: 'Test User'
    };

    const result = validateExtractedData(rawData);
    expect(result.phone).toBe('12345678');
  });

  it('combines high confidence sections', () => {
    const rawData: RawResumeData = {
      skills: [
        { text: 'React', confidence: 0.8 },
        { text: 'TypeScript', confidence: 0.9 }
      ]
    };

    const result = validateExtractedData(rawData);
    expect(result.skills).toBeDefined();
    expect(result.skills).toContain('React');
    expect(result.skills).toContain('TypeScript');
  });
});
