import { render, screen } from '@testing-library/react';
import Main from '@/components/Main';
import useAuth from '@/hooks/useAuth';
import { useTranslation } from '@/components/i18n/client';

jest.mock('@/hooks/useAuth');
jest.mock('@/components/i18n/client', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@/components/LoaderBase', () => () => <div>Loading...</div>);
jest.mock('@/components/Header', () => () => <h1>My App Header</h1>); // Mock the Header component
jest.mock('@/components/Button', () => (props) => (
  <button {...props}>{props.children}</button>
));
jest.mock('@/utils/firebase.ts', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: {} }),
    ),
  },
}));
describe('Main Component', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ loading: false }); // Ensure loading is false
  });

  it('renders the Header component', () => {
    render(<Main>Some content</Main>);

    // Check if the header is rendered
    const heading = screen.getByRole('heading', { name: /my app header/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Main>
        <p>Child content</p>
      </Main>,
    ); // Use <p> to ensure it's a block element

    // Check if children are rendered
    expect(screen.getByText('Child content')).toBeInTheDocument(); // This will now find the text
  });

  it('renders LoaderBase when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({ loading: true }); // Mock loading to true

    render(<Main>Some content</Main>);

    // Check if the LoaderBase component is rendered
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
