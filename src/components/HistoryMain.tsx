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
import { useTranslation } from './i18n/client';

const HistoryMain = () => {
  const { t } = useTranslation();
  const { currentUser, loading } = useAuth();
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);

  useEffect(() => {
    if (currentUser) {
      const fetchedHistory = getRequestHistoryFromLocalStorage(currentUser.uid);
      setHistory(fetchedHistory);
    }
  }, [currentUser]);

  if (loading) {
    return <Typography variant="body1">{t('loading')}...</Typography>;
  }

  if (!currentUser) {
    return (
      <Box mt={2}>
        <Typography variant="body1">{t('empty_history')}</Typography>
        <ButtonBase href="/restful">{t('client_restful')}</ButtonBase>
        <ButtonBase href="/graphiql">{t('client_graphiql')}</ButtonBase>
      </Box>
    );
  }

  const clearMyHistory = () => {
    clearRequestHistory(currentUser.uid);
    setHistory([]);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        {t('request_history')}
      </Typography>

      {history.length === 0 ? (
        <Box mt={2}>
          <Typography variant="body1">{t('empty_history')}</Typography>
          <ButtonBase href="/restful">{t('client_restful')}</ButtonBase>
          <ButtonBase href="/graphiql">{t('client_graphiql')}</ButtonBase>
        </Box>
      ) : (
        <Box>
          {history.map((item) => (
            <Box key={item.id} mb={2}>
              <Typography variant="body1">
                <ButtonBase
                  href={`/${item.type === 'REST' ? 'restful' : 'graphiql'}?id=${item.id}`}
                >
                  {item.type} {t('request')} -{' '}
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
            {t('clear_history')}
          </ButtonBase>
        </Box>
      )}
    </Box>
  );
};

export default withAuth(HistoryMain);
