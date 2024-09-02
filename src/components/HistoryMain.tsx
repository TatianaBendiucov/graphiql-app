'use client';

import ButtonBase from '@/components/Button';
import { Box, Typography } from '@mui/material';
import {
  clearRequestHistory,
  getRequestHistoryFromLocalStorage,
  RequestHistoryItem,
} from '@/utils/localStorageHelpers';
import { useRouter } from 'next/navigation';
import withAuth from '@/utils/withAuth';

const HistoryMain = () => {
  const router = useRouter();
  const history = getRequestHistoryFromLocalStorage();

  const handleNavigation = (item: RequestHistoryItem) => {
    const url = item.type === 'REST' ? '/restful' : '/graphiql';
    router.push(`${url}?id=${item.id}`);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Request History
      </Typography>

      {history.length === 0 ? (
        <Box mt={2}>
          <Typography variant="body1">
            It\'s empty here. Try those options:
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
            handleClick={() => clearRequestHistory()}
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
