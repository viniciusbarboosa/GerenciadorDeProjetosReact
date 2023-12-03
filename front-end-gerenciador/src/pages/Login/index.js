import React from 'react';
import LoginForm from '../../components/Login/LoginForm';
import {  Grid } from '@mui/material';

const Login = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4}>
        <LoginForm />
      </Grid>
      <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
      </Grid>
    </Grid>
  );
};

export default Login;