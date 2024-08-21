'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import useAuth from '@/hooks/useAuth';
import ButtonBase from './Button';

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <ButtonBase 
            href={'/'}
          >Home</ButtonBase>
        </Typography>
        {!currentUser ?
          <Box>
            <ButtonBase 
              href={'/signup'}
            >Sign Up</ButtonBase>
            <ButtonBase 
              href={'/signin'}
            >Sign In</ButtonBase>
          </Box>
          : <Box>
            <ButtonBase 
              href={'/'}
              handleClick={handleSignOut}
            >Log Out</ButtonBase>
          </Box>}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
