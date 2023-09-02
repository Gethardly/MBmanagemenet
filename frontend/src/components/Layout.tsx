import React, { PropsWithChildren, ReactNode } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import AppToolbar from './AppToolbar/AppToolbar';

interface Props extends PropsWithChildren {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <AppToolbar />
      <Box component="main">
        <Container maxWidth={false}>{children}</Container>
      </Box>
    </>
  );
};

export default Layout;
