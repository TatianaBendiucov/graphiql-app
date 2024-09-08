import useAuth from '@/hooks/useAuth';
import { FC } from 'react';

const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
): FC<P> => {
  return (props: P) => {
    const { loading, currentUser, t } = useAuth();

    if (loading) {
      return <div>{t('loading')}...</div>;
    }

    if (!currentUser) return <p>{t('private')}</p>;

    return <Component {...props} />;
  };
};

export default withAuth;
