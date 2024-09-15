import { render, screen, fireEvent } from '@testing-library/react';
import ButtonBase from '@/components/Button';

jest.mock('next/link', () => {
  return ({ children }) => <div>{children}</div>;
});

describe('ButtonBase', () => {
  it('renders correctly with children', () => {
    render(<ButtonBase>Click Me</ButtonBase>);

    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls handleClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ButtonBase handleClick={handleClick}>Click Me</ButtonBase>);

    fireEvent.click(screen.getByText('Click Me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders CircularProgress when disabled', () => {
    render(<ButtonBase disabled>Click Me</ButtonBase>);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('does not render CircularProgress when not disabled', () => {
    render(<ButtonBase>Click Me</ButtonBase>);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
