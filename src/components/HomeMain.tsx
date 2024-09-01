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

const HomeMain: React.FC = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);
  return (
    <Container maxWidth="md">
      {currentUser ? (
        <>
          <Box>Welcome back, {currentUser.displayName}!</Box>
          <Box sx={{ my: 4 }}>
            <Typography variant="h3" align="center" gutterBottom>
              API Tools Hub
            </Typography>
            <Typography variant="h6" align="center" paragraph>
              Select a tool to start exploring the APIs
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      RESTful API Playground
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Test and interact with RESTful APIs.
                    </Typography>
                    <ButtonBase
                      href="/restful"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Go to RESTful
                    </ButtonBase>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      GraphiQL Playground
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Explore and query your GraphQL APIs.
                    </Typography>
                    <ButtonBase
                      href="/graphiql"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Go to GraphiQL
                    </ButtonBase>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      API History
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Review and manage your API call history.
                    </Typography>
                    <ButtonBase
                      href="/history"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Go to History
                    </ButtonBase>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <Box>Welcome!</Box>
          <Grid container spacing={3} justifyContent="center">
            <ButtonBase
              href="/signup"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign up
            </ButtonBase>
            <ButtonBase
              href="/signin"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign in
            </ButtonBase>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default HomeMain;
