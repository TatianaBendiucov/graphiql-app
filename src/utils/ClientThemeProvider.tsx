'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light'
  },
});

const ClientThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ClientThemeProvider;