"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { schema } from '@/utils/validations/SignInSchema';
import { useTranslation } from './i18n/client';
import { showToast } from './ShowToast';

interface SignInFormInputs {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    mode: "all",
    resolver: yupResolver(schema),
  });

  // const [error, setError] = React.useState<string | null>(null);
  // const [success, setSuccess] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // setError(null);
      showToast('success', 'Login was syccessifuly');
    } catch (error: any) {
      showToast('error', error.message);
      // setError(error.message);
      // setSuccess(null);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
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
          {/* {error && <Typography color="error">{error}</Typography>} */}
          {/* {success && <Typography color="primary">{success}</Typography>} */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('sign_in')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
