import { Button, Grid } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={2}>
        <Link to="/payment">
          <Button variant="contained">Пополнение</Button>
        </Link>
      </Grid>
      <Grid item xs={2}>
        <Link to="/withdraw">
          <Button variant="contained">Вывод</Button>
        </Link>
      </Grid>
      <Grid item xs={2}>
        <Link to="/payment-history">
          <Button variant="contained">История пополнений</Button>
        </Link>
      </Grid>
      <Grid item xs={2}>
        <Link to="/withdraw-history">
          <Button variant="contained">История выводов</Button>
        </Link>
      </Grid>
    </Grid>

  );
};

export default Home;