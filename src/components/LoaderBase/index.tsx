import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from '../i18n/client';

const LoaderBase = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
      }}
    >
      <CircularProgress />
      {t('loading')}...
    </Box>
  );
};

export default LoaderBase;
