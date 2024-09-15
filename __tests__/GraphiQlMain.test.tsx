import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GraphiQlMain from '@/components/GraphiQlMain';
import useAuth from '@/hooks/useAuth';
import {
  saveRequestToLocalStorage,
  getRequestById,
} from '@/utils/localStorageHelpers';
import { showToast } from '@/components/ShowToast';

jest.mock('@/hooks/useAuth');
jest.mock('@/utils/localStorageHelpers');
jest.mock('@/components/ShowToast');
jest.mock('cm6-graphql', () => ({
  graphql: jest.fn(),
}));
jest.mock('@/components/IntrospectionDrawer', () => {
  return function MockIntrospectionDrawer({ isOpen }) {
    return isOpen ? <div data-testid="drawer">Drawer</div> : null;
  };
});
jest.mock('@/components/i18n/client', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
jest.mock('@/utils/firebase.ts', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: {} }),
    ),
  },
}));

jest.mock('cm6-graphql', () => ({
  graphql: jest.fn(),
}));

jest.mock('@codemirror/lang-json', () => ({
  json: jest.fn(),
}));

jest.mock('@uiw/react-codemirror', () => ({
  __esModule: true,
  default: jest.fn(({ value, onChange }) => (
    <textarea
      data-testid="codemirror"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )),
}));

jest.mock(
  '@/utils/withAuth',
  () => (Component: React.ComponentType) => (props) => <Component {...props} />,
);
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => 'mocked_id'),
  })),
}));
describe('GraphQLPlayground', () => {
  let originalWarn: jest.SpyInstance;
  let originalError: jest.SpyInstance;

  beforeAll(() => {
    originalWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    originalError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    originalWarn.mockRestore();
    originalError.mockRestore();
  });

  const mockCurrentUser = {
    uid: 'test-uid',
    getIdToken: jest.fn().mockResolvedValue('mock-token'),
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
      loading: false,
    });

    (getRequestById as jest.Mock).mockReturnValue(null);
    (saveRequestToLocalStorage as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the GraphQLPlayground component', () => {
    render(<GraphiQlMain />);

    expect(screen.getByText('title_graphiql')).toBeInTheDocument();
    expect(screen.getByText('inputs.headers')).toBeInTheDocument();
    expect(screen.getByText('sdl_run')).toBeInTheDocument();
  });

  it('displays validation errors when fields are invalid', async () => {
    render(<GraphiQlMain />);

    fireEvent.change(screen.getByLabelText('inputs.endpoint'), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'run_query' }));

    await waitFor(() => {
      expect(
        screen.getByText(/endpoint is a required field/i),
      ).toBeInTheDocument();
    });
  });

  it('runs query successfully when form is valid', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: { character: { id: '1', name: 'Rick Sanchez' } },
      }),
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
    });

    render(<GraphiQlMain />);

    fireEvent.change(screen.getByLabelText('inputs.endpoint'), {
      target: { value: 'https://rickandmortyapi.com/graphql' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'run_query' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
      );
      expect(showToast).toHaveBeenCalledWith('success', 'success');
    });

    mockFetch.mockRestore();
  });

  it('handles API error gracefully', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Bad Request',
      json: async () => ({}),
      headers: new Headers(),
      redirected: false,
      type: 'basic',
      url: '',
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
    });

    render(<GraphiQlMain />);

    fireEvent.change(screen.getByLabelText('inputs.endpoint'), {
      target: { value: 'https://rickandmortyapi.com/graphql' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'run_query' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
      );
      expect(showToast).toHaveBeenCalledWith('error', 'http_error_status 500');
    });

    mockFetch.mockRestore();
  });

  it('adds and removes headers', () => {
    render(<GraphiQlMain />);

    const addButton = screen.getByTestId('addHeader-test');
    fireEvent.click(addButton);

    expect(screen.getAllByLabelText('inputs.header_key').length).toBe(1);

    const removeButton = screen.getByTestId('removeHeader-test');
    fireEvent.click(removeButton);

    expect(screen.queryAllByLabelText('inputs.header_key').length).toBe(0);
  });

  it('calls handleSdlQuery and shows success toast on successful SDL fetch', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: { character: { id: '1', name: 'Rick Sanchez' } },
      }),
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
    });

    render(<GraphiQlMain />);
    fireEvent.change(screen.getByLabelText('inputs.sdl_endpoint'), {
      target: { value: 'https://example.com/graphql' },
    });

    const sdlButton = screen.getByRole('button', { name: 'sdl_run' });

    fireEvent.click(sdlButton);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
      );
    });
  });
});
