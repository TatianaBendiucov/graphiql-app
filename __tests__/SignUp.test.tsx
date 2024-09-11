import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '@/components/SignUp';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/ShowToast';
import useAuth from '@/hooks/useAuth';

jest.mock('@/utils/firebase.ts', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: {} }),
    ),
  },
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/i18n/client', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/hooks/useAuth', () => jest.fn());

jest.mock('@/components/ShowToast', () => ({
  showToast: jest.fn(),
}));

describe('SignUp Component', () => {
  const mockPush = jest.fn();
  const mockShowToast = showToast as jest.Mock;
  const mockCreateUserWithEmailAndPassword =
    createUserWithEmailAndPassword as jest.Mock;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign-up form', () => {
    render(<SignUp />);

    expect(screen.getByLabelText(/inputs.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/inputs.password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/inputs.name/i)).toBeInTheDocument();
  });

  it('calls Firebase createUserWithEmailAndPassword and updateProfile on form submit', async () => {
    const { getByLabelText } = render(<SignUp />);
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123', email: 'test@example.com' },
    });
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);
    fireEvent.change(getByLabelText(/inputs.email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByLabelText(/inputs.password/i), {
      target: { value: 'password123.Q' },
    });
    fireEvent.change(getByLabelText(/inputs.name/i), {
      target: { value: 'Test User' },
    });

    const submitButton = screen.getByRole('button', { name: /sign_up/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123.Q',
      );
      expect(updateProfile).toHaveBeenCalledWith(
        { uid: '123', email: 'test@example.com' },
        { displayName: 'Test User' },
      );
      expect(mockShowToast).toHaveBeenCalledWith('success', 'login_successful');
    });
  });

  it('shows error message when Firebase fails', async () => {
    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error('Firebase Error'),
    );

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/inputs.email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/inputs.password/i), {
      target: { value: 'password123.Q' },
    });
    fireEvent.change(screen.getByLabelText(/inputs.name/i), {
      target: { value: 'Test User' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign_up/i }));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('error', 'Firebase Error');
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects to home if user is already authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { uid: '12345' } });

    render(<SignUp />);

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
