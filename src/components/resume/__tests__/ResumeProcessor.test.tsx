
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import ResumeProcessor from '../ResumeProcessor';
import { extractTextFromPdf } from '@/utils/resume/extractors/pdfExtractor';
import { extractTextFromDocx } from '@/utils/resume/extractors/docxExtractor';

// Mock the file extractors
vi.mock('@/utils/resume/extractors/pdfExtractor');
vi.mock('@/utils/resume/extractors/docxExtractor');

describe('ResumeProcessor', () => {
  const mockOnExtractedData = vi.fn();
  const mockOnProcessingStart = vi.fn();
  const mockOnProcessingEnd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes PDF files successfully', async () => {
    const mockPdfText = 'Extracted PDF content';
    (extractTextFromPdf as any).mockResolvedValue(mockPdfText);

    const { processFile } = ResumeProcessor({
      onExtractedData: mockOnExtractedData,
      onProcessingStart: mockOnProcessingStart,
      onProcessingEnd: mockOnProcessingEnd
    });

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    await processFile(file);

    expect(mockOnProcessingStart).toHaveBeenCalled();
    expect(extractTextFromPdf).toHaveBeenCalledWith(file);
    expect(mockOnProcessingEnd).toHaveBeenCalled();
  });

  it('processes DOCX files successfully', async () => {
    const mockDocxText = 'Extracted DOCX content';
    (extractTextFromDocx as any).mockResolvedValue(mockDocxText);

    const { processFile } = ResumeProcessor({
      onExtractedData: mockOnExtractedData,
      onProcessingStart: mockOnProcessingStart,
      onProcessingEnd: mockOnProcessingEnd
    });

    const file = new File(['dummy content'], 'test.docx', { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    await processFile(file);

    expect(mockOnProcessingStart).toHaveBeenCalled();
    expect(extractTextFromDocx).toHaveBeenCalledWith(file);
    expect(mockOnProcessingEnd).toHaveBeenCalled();
  });

  it('handles file processing errors', async () => {
    const error = new Error('Processing failed');
    (extractTextFromPdf as any).mockRejectedValue(error);

    const { processFile } = ResumeProcessor({
      onExtractedData: mockOnExtractedData,
      onProcessingStart: mockOnProcessingStart,
      onProcessingEnd: mockOnProcessingEnd
    });

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    await processFile(file);

    expect(mockOnProcessingEnd).toHaveBeenCalledWith(error.message);
  });
});
