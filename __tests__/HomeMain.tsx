import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeMain from '@/components/HomeMain';
import useAuth from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => jest.fn());
jest.mock('@/components/i18n/client', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('HomeMain component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome message and sign up/sign in buttons when no user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(<HomeMain />);

    expect(screen.getByText('welcome')).toBeInTheDocument();

    expect(screen.getByText('sign_up')).toBeInTheDocument();
    expect(screen.getByText('sign_in')).toBeInTheDocument();
  });

  it('renders welcome back message and API hub options when a user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { displayName: 'John Doe' },
    });

    render(<HomeMain />);

    expect(screen.getByText('welcome_back, John Doe!')).toBeInTheDocument();

    expect(screen.getByText('title_api_hub')).toBeInTheDocument();
    expect(screen.getByText('subtitle_api_hub')).toBeInTheDocument();

    expect(screen.getByText('go_restful')).toBeInTheDocument();
    expect(screen.getByText('go_graphiql')).toBeInTheDocument();
    expect(screen.getByText('go_history')).toBeInTheDocument();
  });

  it('renders the correct number of API cards when user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { displayName: 'John Doe' },
    });

    render(<HomeMain />);

    expect(screen.getByText('title_restful')).toBeInTheDocument();
    expect(screen.getByText('title_graphiql')).toBeInTheDocument();
    expect(screen.getByText('title_history')).toBeInTheDocument();
  });
});
