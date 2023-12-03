import React from 'react';
import CadastroForm from '../../components/Cadastro/CadastroForm';
import { Link } from 'react-router-dom';
import { Button, Grid } from '@mui/material';

const Cadastro = () =>{
    return(
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4}>
        <CadastroForm />
      </Grid>
      <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
      </Grid>
    </Grid>
    )
}

export default Cadastro