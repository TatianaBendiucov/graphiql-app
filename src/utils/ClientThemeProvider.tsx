'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  palette: {
    mode: 'light'
  },
});

const ClientThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
      <ToastContainer />
    </ThemeProvider>
  );
};

export default ClientThemeProvider;
