import { render, screen } from '@testing-library/react';
import LoaderBase from '@/components/LoaderBase';
import { useTranslation } from '@/components/i18n/client';

jest.mock('@/components/i18n/client', () => ({
  useTranslation: jest.fn(),
}));

describe('LoaderBase Component', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key, // Simple mock that returns the key itself
    });
  });

  it('renders the loader with correct text', () => {
    render(<LoaderBase />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    expect(screen.getByText('loading...')).toBeInTheDocument();
  });
});
