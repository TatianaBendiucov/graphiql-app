import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => jest.fn());
jest.mock('cookies-next', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}));

jest.mock('@/components/i18n/settings', () => ({
  cookieName: 'language',
  fallbackLng: 'en',
  languages: ['en', 'ru'],
}));

describe('LanguageSwitcher', () => {
  const mockRefresh = jest.fn();
  const cookieName = 'language';

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh });
    (getCookie as jest.Mock).mockReturnValue('en');
    (setCookie as jest.Mock).mockClear();
    mockRefresh.mockClear();
  });

  it('renders the language switcher with the correct initial value', () => {
    render(<LanguageSwitcher />);

    const selectElement = screen.getByDisplayValue('en');
    expect(selectElement).toBeInTheDocument();
  });

  it('changes the language when a new option is selected', () => {
    render(<LanguageSwitcher />);

    const selectButton = screen.getByRole('combobox');
    fireEvent.mouseDown(selectButton);

    const ruOption = screen.getByText('ru');
    fireEvent.click(ruOption);

    expect(setCookie).toHaveBeenCalledWith(cookieName, 'ru');

    expect(screen.getByDisplayValue('ru')).toBeInTheDocument();

    expect(mockRefresh).toHaveBeenCalled();
  });

  it('sets fallback language if no cookie is present', () => {
    (getCookie as jest.Mock).mockReturnValue(null);

    render(<LanguageSwitcher />);

    expect(screen.getByDisplayValue('en')).toBeInTheDocument();
  });
});
