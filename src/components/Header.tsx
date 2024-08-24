'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import useAuth from '@/hooks/useAuth';
import ButtonBase from './Button';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from './i18n/client';

const Header: React.FC = () => {
  const { t } = useTranslation();
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
          >{t('home')}</ButtonBase>
        </Typography>

        <Box>
          <LanguageSwitcher />
        {
          !currentUser ?
            <>
              <ButtonBase 
                href={'/signup'}
              >{t('sign_up')}</ButtonBase>
              <ButtonBase 
                href={'/signin'}
              >{t('sign_in')}</ButtonBase>
            </>
          : 
            <ButtonBase 
              href={'/'}
              handleClick={handleSignOut}
            >{t('log_out')}</ButtonBase>
          }
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
