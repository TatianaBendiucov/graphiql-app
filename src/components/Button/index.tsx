import { Button } from '@mui/material';
import NextLink from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  handleClick?: () => void;
  href?: string;
}

interface Props {
  component?: typeof NextLink;
  href?: string;
}

const ButtonBase = ({
  children,
  handleClick = () => {},
  href = '',
}: ButtonProps) => {
  const props: Props = {};

  if (href) {
    props.component = NextLink;
    props.href = href;
  }

  const batton = (
    <Button color="inherit" onClick={handleClick} {...props}>
      {children}
    </Button>
  );

  return batton;
};

export default ButtonBase;
