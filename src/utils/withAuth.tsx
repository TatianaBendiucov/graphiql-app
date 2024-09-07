import useAuth from '@/hooks/useAuth';
import { FC } from 'react';

const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
): FC<P> => {
  return (props: P) => {
    const { loading, currentUser } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!currentUser) return <p>This route is private</p>;

    return <Component {...props} />;
  };
};

export default withAuth;
