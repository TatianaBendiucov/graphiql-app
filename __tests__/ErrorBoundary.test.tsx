import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/components/ErrorBoundary';

const ProblematicComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
    (console.warn as jest.Mock).mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('renders fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText('ErrorBoundary: Something went wrong.'),
    ).toBeInTheDocument();
  });

  it('does not render children after an error has occurred', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText('ErrorBoundary: Something went wrong.'),
    ).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <div>New Child Component</div>
      </ErrorBoundary>,
    );

    expect(screen.queryByText('New Child Component')).not.toBeInTheDocument();
  });
});
