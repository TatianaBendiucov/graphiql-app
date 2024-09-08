import LoaderBase from '@/components/LoaderBase';
import useAuth from '@/hooks/useAuth';
import { Alert } from '@mui/material';
import { FC } from 'react';

const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
): FC<P> => {
  return (props: P) => {
    const { loading, currentUser, t } = useAuth();

    if (loading) {
      return <LoaderBase />;
    }

    if (!currentUser) return <Alert severity="warning">{t('private')}</Alert>;

    return <Component {...props} />;
  };
};

export default withAuth;
