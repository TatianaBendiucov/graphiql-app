import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoryMain from '@/components/HistoryMain';
import {
  getRequestHistoryFromLocalStorage,
  clearRequestHistory,
} from '@/utils/localStorageHelpers';
import useAuth from '@/hooks/useAuth';

jest.mock('@/components/i18n/client', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/utils/localStorageHelpers', () => ({
  getRequestHistoryFromLocalStorage: jest.fn(),
  clearRequestHistory: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => jest.fn());
jest.mock('@/components/i18n/client', () => ({
  useTranslation: jest.fn(() => ({ t: (key: string) => key })),
}));

jest.mock('@/components/Button', () => ({
  __esModule: true,
  default: ({ children, handleClick, href }) => (
    <button onClick={handleClick} data-testid={href}>
      {children}
    </button>
  ),
}));
jest.mock(
  '@/utils/withAuth',
  () => (Component: React.ComponentType) => (props) => <Component {...props} />,
);
jest.mock('@/components/LoaderBase', () => () => <div>Loading...</div>);

describe('HistoryMain component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null,
      loading: true,
    });

    render(<HistoryMain />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty history and buttons when no user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null,
      loading: false,
    });

    render(<HistoryMain />);

    expect(screen.getByText('empty_history')).toBeInTheDocument();
    expect(screen.getByTestId('/restful')).toBeInTheDocument();
    expect(screen.getByTestId('/graphiql')).toBeInTheDocument();
  });

  it('renders user history and allows clearing history', () => {
    const mockHistory = [{ id: '1', type: 'REST', timestamp: Date.now() }];

    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: '123' },
      loading: false,
    });

    (getRequestHistoryFromLocalStorage as jest.Mock).mockReturnValue(
      mockHistory,
    );

    render(<HistoryMain />);

    expect(screen.getByTestId('/restful?id=1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('clear_history'));

    expect(clearRequestHistory).toHaveBeenCalledWith('123');
  });
});
