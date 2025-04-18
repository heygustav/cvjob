
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import LetterPreviewStep from '../LetterPreviewStep';

describe('LetterPreviewStep', () => {
  const mockLetter = {
    id: '1',
    content: 'Test cover letter content',
    user_id: 'user1',
    job_posting_id: 'job1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  };

  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the letter content', () => {
    renderWithProviders(
      <LetterPreviewStep 
        generatedLetter={mockLetter}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test cover letter content')).toBeInTheDocument();
  });

  it('allows editing the letter content', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LetterPreviewStep 
        generatedLetter={mockLetter}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: /rediger tekst/i });
    await user.click(editButton);

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'Updated content');

    const saveButton = screen.getByRole('button', { name: /gem ændringer/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith('Updated content');
    });
  });

  it('shows keywords section when keywords exist', async () => {
    // Mock localStorage
    const mockKeywords = ['React', 'TypeScript'];
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockReturnValue(JSON.stringify(mockKeywords));

    renderWithProviders(
      <LetterPreviewStep 
        generatedLetter={mockLetter}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    getItemSpy.mockRestore();
  });
});
