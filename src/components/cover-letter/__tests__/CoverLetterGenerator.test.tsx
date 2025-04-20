
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import CoverLetterGenerator from '../CoverLetterGenerator';

describe('CoverLetterGenerator', () => {
  const mockData = {
    id: '1',
    content: 'Test cover letter content',
    job_posting_id: 'job1',
    user_id: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const mockUserInfo = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('renders cover letter content correctly', () => {
    renderWithProviders(
      <CoverLetterGenerator 
        data={mockData}
        jobTitle="Software Developer"
        company="Test Company"
        userInfo={mockUserInfo}
      />
    );

    expect(screen.getByText('Test cover letter content')).toBeInTheDocument();
  });

  it('shows fallback when no content is available', () => {
    renderWithProviders(
      <CoverLetterGenerator 
        data={{ ...mockData, content: '' }}
        jobTitle="Software Developer"
        company="Test Company"
        userInfo={mockUserInfo}
      />
    );

    expect(screen.getByText('Ingen ansøgningstekst tilgængelig')).toBeInTheDocument();
  });
});
