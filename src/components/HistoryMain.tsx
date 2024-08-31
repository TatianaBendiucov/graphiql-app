'use client';

import { Box, Typography, Link, Button } from '@mui/material';
import {
  clearRequestHistory,
  getRequestHistoryFromLocalStorage,
  RequestHistoryItem,
} from '@/utils/localStorageHelpers';
import { useRouter } from 'next/navigation';

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
          <Link href="/restful" variant="body1">
            RESTful Client
          </Link>
          <Link href="/graphiql" variant="body1">
            GraphiQL Client
          </Link>
        </Box>
      ) : (
        <Box>
          {history.map((item) => (
            <Box key={item.id} mb={2}>
              <Typography variant="body1">
                <Link href="#" onClick={() => handleNavigation(item)}>
                  {item.type} Request -{' '}
                  {new Date(item.timestamp).toLocaleString()}
                </Link>
              </Typography>
            </Box>
          ))}
          <Button
            onClick={() => clearRequestHistory()}
            variant="outlined"
            color="secondary"
          >
            Clear History
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default HistoryMain;
