'use client';

import { useEffect, useState } from 'react'; // Import useEffect and useState
import ButtonBase from '@/components/Button';
import { Box, Typography } from '@mui/material';
import {
  clearRequestHistory,
  getRequestHistoryFromLocalStorage,
  RequestHistoryItem,
} from '@/utils/localStorageHelpers';
import withAuth from '@/utils/withAuth';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const HistoryMain = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);

  useEffect(() => {
    if (currentUser) {
      const fetchedHistory = getRequestHistoryFromLocalStorage(currentUser.uid);
      setHistory(fetchedHistory);
    }
  }, [currentUser]);

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (!currentUser) {
    return (
      <Box mt={2}>
        <Typography variant="body1">
          It's empty here. Try those options:
        </Typography>
        <ButtonBase href="/restful">RESTful Client</ButtonBase>
        <ButtonBase href="/graphiql">GraphiQL Client</ButtonBase>
      </Box>
    );
  }

  const handleNavigation = (item: RequestHistoryItem) => {
    const url = item.type === 'REST' ? '/restful' : '/graphiql';
    router.push(`${url}?id=${item.id}`);
  };

  const clearMyHistory = () => {
    clearRequestHistory(currentUser.uid);
    setHistory([]);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Request History
      </Typography>

      {history.length === 0 ? (
        <Box mt={2}>
          <Typography variant="body1">
            It's empty here. Try those options:
          </Typography>
          <ButtonBase href="/restful">RESTful Client</ButtonBase>
          <ButtonBase href="/graphiql">GraphiQL Client</ButtonBase>
        </Box>
      ) : (
        <Box>
          {history.map((item) => (
            <Box key={item.id} mb={2}>
              <Typography variant="body1">
                <ButtonBase handleClick={() => handleNavigation(item)}>
                  {item.type} Request -{' '}
                  {new Date(item.timestamp).toLocaleString()}
                </ButtonBase>
              </Typography>
            </Box>
          ))}
          <ButtonBase
            handleClick={() => clearMyHistory()}
            variant="outlined"
            color="secondary"
          >
            Clear History
          </ButtonBase>
        </Box>
      )}
    </Box>
  );
};

export default withAuth(HistoryMain);
