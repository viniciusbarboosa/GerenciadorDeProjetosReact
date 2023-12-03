import React, { useState } from 'react';
import { Button, TextField, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CadastroForm = () => {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [campoNaoPreenchido, setCampoNaoPreenchido] = useState(false);
  const [senhasNaoCoincidem, setSenhasNaoCoincidem] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !nome || !senha || !confirmarSenha) {
      setCampoNaoPreenchido(true);
      setSenhasNaoCoincidem(false);
      return;
    }

    if (senha !== confirmarSenha) {
      setSenhasNaoCoincidem(true);
      return;
    }

    try {
      await axios.post('http://localhost:3333/cadastrar', {
        nome,
        email,
        senha,
        tipo_usuario: 'dev', 
      });
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      toast.success('Usuário cadastrado', {
        autoClose: 2000, 
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(' ' + error.response.data.error, {
          autoClose: 2000, 
        });
      } else {
        console.error(error);
      }
    }

    setCampoNaoPreenchido(false);
    setSenhasNaoCoincidem(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" align="center">
        Cadastro de Usuário
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={campoNaoPreenchido && !email}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Nome"
            fullWidth
            variant="outlined"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={campoNaoPreenchido && !nome}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Senha"
            type="password"
            fullWidth
            variant="outlined"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            error={campoNaoPreenchido && !senha}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Confirmar Senha"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            error={campoNaoPreenchido && (!confirmarSenha || senhasNaoCoincidem)}
          />
        </Grid>
        {campoNaoPreenchido && (
          <Grid item>
            <Typography variant="body2" color="error">
              Preencha todos os campos.
            </Typography>
          </Grid>
        )}
        {senhasNaoCoincidem && (
          <Grid item>
            <Typography variant="body2" color="error">
              As senhas não coincidem.
            </Typography>
          </Grid>
        )}
        <Grid item>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Cadastrar
          </Button>
        </Grid>
        <Grid item>
          <Typography align="center">
            Já tem uma conta? <Link component={RouterLink} to="/login">Faça login</Link>
          </Typography>
        </Grid>
      </Grid>
      <ToastContainer />
    </form>
  );
};

export default CadastroForm;
