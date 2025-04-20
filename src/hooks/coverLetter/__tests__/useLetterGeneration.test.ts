import { renderHook, act } from '@testing-library/react';
import { useLetterGeneration } from '../hooks/useLetterGeneration';
import { JobFormData } from '@/services/coverLetter/types';
import { beforeEach } from './testHelpers';

// Mock dependencies
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('useLetterGeneration', () => {
  // Mock state functions
  const mockSetIsGenerating = jest.fn();
  const mockSetLoadingState = jest.fn();
  const mockSetJobData = jest.fn();
  const mockSetSelectedJob = jest.fn();
  const mockSetGeneratedLetter = jest.fn();
  const mockSetStep = jest.fn();
  const mockSetError = jest.fn();
  
  // Mock user
  const mockUser = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  };
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });
  
  it('should initialize with the correct values', () => {
    const { result } = renderHook(() => useLetterGeneration({
      completeUser: mockUser,
      setIsGenerating: mockSetIsGenerating,
      setLoadingState: mockSetLoadingState,
      setJobData: mockSetJobData,
      setSelectedJob: mockSetSelectedJob,
      setGeneratedLetter: mockSetGeneratedLetter,
      setStep: mockSetStep,
      setError: mockSetError,
    }));
    
    // Check that functions exist
    expect(result.current.handleGenerateLetter).toBeDefined();
    expect(result.current.handleEditContent).toBeDefined();
  });
  
  it('should handle letter generation', async () => {
    const { result } = renderHook(() => useLetterGeneration({
      completeUser: mockUser,
      setIsGenerating: mockSetIsGenerating,
      setLoadingState: mockSetLoadingState,
      setJobData: mockSetJobData,
      setSelectedJob: mockSetSelectedJob,
      setGeneratedLetter: mockSetGeneratedLetter,
      setStep: mockSetStep,
      setError: mockSetError,
    }));
    
    const jobData: JobFormData = {
      title: 'Software Developer',
      company: 'Tech Company',
      description: 'Job description here',
    };
    
    // Use act to wrap async state updates
    await act(async () => {
      await result.current.handleGenerateLetter(jobData);
    });
    
    // Verify state updates
    expect(mockSetIsGenerating).toHaveBeenCalledWith(true);
    expect(mockSetIsGenerating).toHaveBeenCalledWith(false);
    expect(mockSetLoadingState).toHaveBeenCalledWith('generating');
    expect(mockSetLoadingState).toHaveBeenCalledWith('idle');
    expect(mockSetSelectedJob).toHaveBeenCalled();
    expect(mockSetGeneratedLetter).toHaveBeenCalled();
    expect(mockSetStep).toHaveBeenCalledWith(2);
  });
  
  it('should handle letter editing', async () => {
    const { result } = renderHook(() => useLetterGeneration({
      completeUser: mockUser,
      setIsGenerating: mockSetIsGenerating,
      setLoadingState: mockSetLoadingState,
      setJobData: mockSetJobData,
      setSelectedJob: mockSetSelectedJob,
      setGeneratedLetter: mockSetGeneratedLetter,
      setStep: mockSetStep,
      setError: mockSetError,
    }));
    
    const updatedContent = 'Updated letter content';
    
    await act(async () => {
      await result.current.handleEditContent(updatedContent);
    });
    
    // Verify state updates
    expect(mockSetIsGenerating).toHaveBeenCalledWith(true);
    expect(mockSetIsGenerating).toHaveBeenCalledWith(false);
  });
  
  it('should handle errors during generation', async () => {
    // Mock implementation that throws an error
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    const { result } = renderHook(() => useLetterGeneration({
      completeUser: mockUser,
      setIsGenerating: mockSetIsGenerating,
      setLoadingState: mockSetLoadingState,
      setJobData: mockSetJobData,
      setSelectedJob: mockSetSelectedJob,
      setGeneratedLetter: mockSetGeneratedLetter,
      setStep: mockSetStep,
      setError: mockSetError,
    }));
    
    const jobData: JobFormData = {
      title: 'Software Developer',
      company: 'Tech Company',
      description: 'Job description here',
    };
    
    await act(async () => {
      await result.current.handleGenerateLetter(jobData);
    });
    
    // Verify error handling
    expect(mockSetError).toHaveBeenCalled();
    expect(mockSetIsGenerating).toHaveBeenCalledWith(false);
    expect(mockSetLoadingState).toHaveBeenCalledWith('idle');
  });
});
