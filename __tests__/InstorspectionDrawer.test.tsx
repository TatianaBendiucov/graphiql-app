import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IntrospectionDrawer from '@/components/IntrospectionDrawer';

describe('IntrospectionDrawer component', () => {
  const toggleDrawerMock = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((message) => {
      if (message.includes('validateDOMNesting')) {
        return;
      }
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the drawer when isDrawerOpen is true', () => {
    render(
      <IntrospectionDrawer
        isDrawerOpen={true}
        toggleDrawer={toggleDrawerMock}
        schemaData={{}}
      />,
    );

    expect(screen.getByTestId('introspection-drawer')).toBeInTheDocument();
  });

  it('does not render the drawer when isDrawerOpen is false', () => {
    render(
      <IntrospectionDrawer
        isDrawerOpen={false}
        toggleDrawer={toggleDrawerMock}
        schemaData={{}}
      />,
    );

    expect(
      screen.queryByTestId('introspection-drawer'),
    ).not.toBeInTheDocument();
  });

  it('renders schema data correctly', () => {
    const schemaData = {
      queryType: {
        fields: [
          { name: 'field1', type: 'String' },
          { name: 'field2', type: 'Int' },
        ],
      },
      mutationType: {
        fields: [{ name: 'createItem', type: 'Item' }],
      },
    };

    const { getByText } = render(
      <IntrospectionDrawer
        isDrawerOpen={true}
        toggleDrawer={toggleDrawerMock}
        schemaData={schemaData}
      />,
    );

    expect(getByText(/"field1"/)).toBeInTheDocument();
    expect(getByText(/"field2"/)).toBeInTheDocument();
    expect(getByText(/"createItem"/)).toBeInTheDocument();
  });

  it('renders loading message when schemaData is undefined', () => {
    render(
      <IntrospectionDrawer
        isDrawerOpen={true}
        toggleDrawer={toggleDrawerMock}
        schemaData={undefined}
      />,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
