import { Button } from '@mui/material';
import NextLink from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  handleClick?: () => void;
  href?: string;
  target?: string;
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
  target?: string;
}

const ButtonBase = ({
  children,
  handleClick = () => {},
  href = '',
  target = '',
  variant = 'contained',
  color = 'primary',
  type = 'button',
  fullWidth = false,
}: ButtonProps) => {
  const props: Props = {};

  if (href) {
    props.component = NextLink;
    props.href = href;

    if (target.length) {
      props.target = target;
    }
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
