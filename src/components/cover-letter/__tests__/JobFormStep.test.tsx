
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import JobFormStep from '../JobFormStep';

describe('JobFormStep', () => {
  const mockOnSubmit = vi.fn();
  const mockOnSave = vi.fn();
  const mockResetError = vi.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
    resetError: mockResetError,
    onSave: mockOnSave
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the job form with all required fields', () => {
    renderWithProviders(<JobFormStep {...defaultProps} />);

    expect(screen.getByLabelText(/jobtitel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/virksomhed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/beskrivelse/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobFormStep {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /generer/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/jobtitel er påkrævet/i)).toBeInTheDocument();
      expect(screen.getByText(/virksomhed er påkrævet/i)).toBeInTheDocument();
      expect(screen.getByText(/beskrivelse er påkrævet/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobFormStep {...defaultProps} />);

    await user.type(screen.getByLabelText(/jobtitel/i), 'Software Developer');
    await user.type(screen.getByLabelText(/virksomhed/i), 'Test Company');
    await user.type(screen.getByLabelText(/beskrivelse/i), 'Job description here');

    const submitButton = screen.getByRole('button', { name: /generer/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Software Developer',
        company: 'Test Company',
        description: 'Job description here',
        contact_person: '',
        url: '',
        deadline: ''
      });
    });
  });

  it('saves draft when save button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobFormStep {...defaultProps} />);

    await user.type(screen.getByLabelText(/jobtitel/i), 'Draft Job');
    await user.type(screen.getByLabelText(/virksomhed/i), 'Draft Company');

    const saveButton = screen.getByRole('button', { name: /gem kladde/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Draft Job',
        company: 'Draft Company',
        description: '',
        contact_person: '',
        url: '',
        deadline: ''
      });
    });
  });
});
