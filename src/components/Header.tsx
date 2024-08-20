'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import useAuth from '@/hooks/useAuth';

const Header: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  console.log(currentUser);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => router.push('/')}>
            Home
          </Button>
        </Typography>
        {!currentUser ?
          <Box>
            <Button color="inherit" onClick={() => router.push('/signup')}>
              Sign Up
            </Button>
            <Button color="inherit" onClick={() => router.push('/signin')}>
              Sign In
            </Button>
          </Box>
          : <Box>
            <Button color="inherit" onClick={handleSignOut}>Log Out </Button>
          </Box>}
      </Toolbar>
    </AppBar>
  );
};

export default Header;