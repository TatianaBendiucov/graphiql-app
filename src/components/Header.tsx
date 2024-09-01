'use client';

import React from 'react';
import { AppBar, Box } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import useAuth from '@/hooks/useAuth';
import ButtonBase from './Button';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from './i18n/client';
import Image from 'next/image';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <AppBar position="sticky">
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <ButtonBase href={'/'}>
          <Image src="/logo.png" alt="Logo" width={130} height={30} />
        </ButtonBase>

        <Box>
          <LanguageSwitcher />
          {!currentUser ? (
            <>
              <ButtonBase href={'/signup'}>{t('sign_up')}</ButtonBase>
              <ButtonBase href={'/signin'}>{t('sign_in')}</ButtonBase>
            </>
          ) : (
            <ButtonBase href={'/'} handleClick={handleSignOut}>
              {t('log_out')}
            </ButtonBase>
          )}
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
