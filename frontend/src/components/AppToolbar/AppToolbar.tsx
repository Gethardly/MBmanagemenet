import React from 'react';
import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import UserMenu from './UserMenu';
import AnonymousMenu from './AnonymousMenu';
import { Link } from 'react-router-dom';

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="static" sx={{ mb: "20px" }}>
      <Toolbar>
        <Grid container sx={{ alignItems: "center" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, alignItems: "center" }}
          >
            <Link
              style={{ color: "#fff", textDecoration: "none" }}
              to={user ? "/" : "#"}
            >
              MBmanagement
            </Link>
          </Typography>
          <Grid item>
            {user ? <UserMenu user={user} /> : <AnonymousMenu />}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
