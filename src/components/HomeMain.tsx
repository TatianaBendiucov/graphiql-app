'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

const HomeMain: React.FC = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);
  return (
    <Container maxWidth="md">
      {!currentUser ? (
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
                  <Link href="/restful-api-playground" passHref>
                    <Button variant="contained" color="primary" fullWidth>
                      Go to RESTful
                    </Button>
                  </Link>
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
                  <Link href="/graphiql-playground" passHref>
                    <Button variant="contained" color="primary" fullWidth>
                      Go to GraphiQL
                    </Button>
                  </Link>
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
                  <Link href="/history" passHref>
                    <Button variant="contained" color="primary" fullWidth>
                      Go to History
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box>Welcome back, !</Box>
      )}
    </Container>
  );
};

export default HomeMain;
