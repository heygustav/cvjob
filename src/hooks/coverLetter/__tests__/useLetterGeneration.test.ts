
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLetterGeneration } from '../useLetterGeneration';

describe('useLetterGeneration', () => {
  const mockSetters = {
    setIsGenerating: vi.fn(),
    setLoadingState: vi.fn(),
    setJobData: vi.fn(),
    setSelectedJob: vi.fn(),
    setGeneratedLetter: vi.fn(),
    setStep: vi.fn(),
    setError: vi.fn()
  };

  const mockUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    profileComplete: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles letter generation correctly', async () => {
    const { result } = renderHook(() => useLetterGeneration({
      completeUser: mockUser,
      ...mockSetters
    }));

    const jobData = {
      title: 'Software Developer',
      company: 'Test Company',
      description: 'Test description'
    };

    await act(async () => {
      await result.current.handleGenerateLetter(jobData);
    });

    expect(mockSetters.setIsGenerating).toHaveBeenCalledWith(true);
    expect(mockSetters.setLoadingState).toHaveBeenCalledWith('generating');
    expect(mockSetters.setJobData).toHaveBeenCalledWith(jobData);
    expect(mockSetters.setGeneratedLetter).toHaveBeenCalled();
    expect(mockSetters.setStep).toHaveBeenCalledWith(2);
  });

  it('handles generation errors correctly', async () => {
    const { result } = renderHook(() => useLetterGeneration({
      completeUser: mockUser,
      ...mockSetters
    }));

    const error = new Error('Generation failed');
    vi.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw error;
    });

    await act(async () => {
      await result.current.handleGenerateLetter({
        title: 'Test',
        company: 'Test',
        description: 'Test'
      });
    });

    expect(mockSetters.setError).toHaveBeenCalledWith(error.message);
    expect(mockSetters.setIsGenerating).toHaveBeenCalledWith(false);
    expect(mockSetters.setLoadingState).toHaveBeenCalledWith('idle');
  });
});
