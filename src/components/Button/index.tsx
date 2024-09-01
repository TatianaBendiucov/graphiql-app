import { Button } from '@mui/material';
import NextLink from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  handleClick?: () => void;
  href?: string;
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}

interface Props {
  component?: typeof NextLink;
  href?: string;
}

const ButtonBase = ({
  children,
  handleClick = () => {},
  href = '',
  variant = 'contained',
  color = 'inherit',
  type = 'button',
  fullWidth = false,
}: ButtonProps) => {
  const props: Props = {};

  if (href) {
    props.component = NextLink;
    props.href = href;
  }

  const batton = (
    <Button
      variant={variant}
      color={color}
      onClick={handleClick}
      fullWidth={fullWidth}
      type={type}
      {...props}
    >
      {children}
    </Button>
  );

  return batton;
};

export default ButtonBase;
