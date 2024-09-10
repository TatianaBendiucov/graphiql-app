'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Box, Typography, Container } from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { schema } from '@/utils/validations/SignUpSchema';
import { useTranslation } from './i18n/client';
import { showToast } from './ShowToast';
import { useRouter } from 'next/navigation';
import ButtonBase from './Button';
import useAuth from '@/hooks/useAuth';

interface SignUpFormInputs {
  email: string;
  password: string;
  name: string;
}

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    mode: 'all',
    resolver: yupResolver(schema(t)),
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: data.name,
      });
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
          {t('sign_up')}
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
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label={t('inputs.name')}
            type="text"
            id="name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            autoComplete="name"
          />
          <ButtonBase
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {t('sign_up')}
          </ButtonBase>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
