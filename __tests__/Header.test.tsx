import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';
import useAuth from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';

jest.mock('@/utils/firebase.ts', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: {} }),
    ),
  },
}));

jest.mock('@/hooks/useAuth', () => jest.fn());
jest.mock('@/components/i18n/client', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

jest.mock('@/components/LanguageSwitcher', () => () => (
  <div>LanguageSwitcher</div>
));

jest.mock('next/image', () => (props) => <img {...props} />);

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Sign Up and Sign In buttons when no user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(<Header />);

    expect(screen.getByText('sign_up')).toBeInTheDocument();
    expect(screen.getByText('sign_in')).toBeInTheDocument();
  });

  it('renders Log Out button when a user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { uid: '123' } });

    render(<Header />);

    expect(screen.getByText('log_out')).toBeInTheDocument();
  });

  it('calls signOut when the Log Out button is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { uid: '123' } });

    render(<Header />);

    const logOutButton = screen.getByText('log_out');
    fireEvent.click(logOutButton);

    expect(signOut).toHaveBeenCalledWith(auth);
  });

  it('renders the logo image', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(<Header />);

    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo-project.png');
  });
});
