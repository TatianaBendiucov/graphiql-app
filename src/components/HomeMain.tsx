'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import useAuth from '@/hooks/useAuth';
import ButtonBase from './Button';
import { useTranslation } from './i18n/client';

const HomeMain: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="md">
      {currentUser ? (
        <>
          <Box>
            {t('welcome_back')}, {currentUser.displayName}!
          </Box>
          <Box sx={{ my: 4 }}>
            <Typography variant="h3" align="center" gutterBottom>
              {t('title_api_hub')}
            </Typography>
            <Typography variant="h6" align="center" paragraph>
              {t('subtitle_api_hub')}
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {t('title_restful')}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {t('desc_restful')}
                    </Typography>
                    <ButtonBase
                      href="/restful"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {t('go_restful')}
                    </ButtonBase>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {t('title_graphiql')}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {t('desc_graphiql')}
                    </Typography>
                    <ButtonBase
                      href="/graphiql"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {t('go_graphiql')}
                    </ButtonBase>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {t('title_history')}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {t('desc_history')}
                    </Typography>
                    <ButtonBase
                      href="/history"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {t('go_history')}
                    </ButtonBase>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <Box>{t('welcome')}</Box>
          <Grid container spacing={3} justifyContent="center">
            <ButtonBase
              href="/signup"
              variant="contained"
              color="primary"
              fullWidth
            >
              {t('sign_up')}
            </ButtonBase>
            <ButtonBase
              href="/signin"
              variant="contained"
              color="primary"
              fullWidth
            >
              {t('sign_in')}
            </ButtonBase>
          </Grid>
        </>
      )}
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              {t('oleg_name')}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {t('oleg_desc')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              {t('tanya_name')}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {t('tanya_desc')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              {t('nikita_name')}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {t('nikita_desc')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              {t('project_name')}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {t('project_desc')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
};

export default HomeMain;
