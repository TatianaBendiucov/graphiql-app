'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Box, Typography, Container } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { schema } from '@/utils/validations/SignInSchema';
import { useTranslation } from './i18n/client';
import { showToast } from './ShowToast';
import { useRouter } from 'next/navigation';
import ButtonBase from './Button';
import useAuth from '@/hooks/useAuth';
interface SignInFormInputs {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      showToast('success', t('login_successful'));
      router.push('/');
    } catch (error) {
      showToast('error', error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {t('sign_in')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label={t('inputs.email')}
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('inputs.password')}
            type="password"
            id="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
          />
          <ButtonBase
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {t('sign_in')}
          </ButtonBase>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
