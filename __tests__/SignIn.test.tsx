import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import SignIn from '@/components/SignIn';
import { signInWithEmailAndPassword } from 'firebase/auth';
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

jest.mock('@/components/ShowToast', () => ({
  showToast: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/hooks/useAuth', () => jest.fn());

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('@/components/i18n/client', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls Firebase signInWithEmailAndPassword on form submit', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123', email: 'test@example.com' },
    });
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { uid: '123' } });

    const { getByLabelText, getByRole } = render(<SignIn />);

    fireEvent.change(getByLabelText(/inputs.email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByLabelText(/inputs.password/i), {
      target: { value: 'password123.Q' },
    });

    const submitButton = getByRole('button', { name: /sign_in/i });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123.Q',
      );

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message when Firebase sign-in fails', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error('Firebase Error'),
    );

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/inputs.email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/inputs.password/i), {
      target: { value: 'password123' },
    });

    const submitButton = screen.getByRole('button', { name: /sign_in/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith('error', 'Firebase Error');
    });
  });
});
