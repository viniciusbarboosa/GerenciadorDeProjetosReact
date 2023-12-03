import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Link } from '@mui/material';
import { Link as RouterLink  } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [campoNaoPreenchido, setCampoNaoPreenchido] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !senha) {
      // Pelo menos um campo está vazio
      setCampoNaoPreenchido(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3333/login', JSON.stringify({ nome, senha }), {
        headers: { 'Content-Type': 'application/json' }
      });

      navigate('/', { state: { user: response.data } });
      toast.success('Login bem-sucedido!', { position: toast.POSITION.TOP_CENTER,autoClose: 2000  });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Exibir notificação de erro
        toast.error('Credenciais inválidas. Por favor, verifique seu nome e senha.', { position: toast.POSITION.TOP_CENTER,autoClose: 2000 });
      }else if(error.response && error.response.status === 402){
        toast.error('Usuário Desativado Verifique com o ADM do projeto', { position: toast.POSITION.TOP_CENTER,autoClose: 2000 });
      } else {
        // Exibir notificação de erro genérico
        toast.error('Erro ao fazer a solicitação.', { position: toast.POSITION.TOP_CENTER });
      }
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" align="center">
        Login
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <TextField
            label="Nome"
            type="text"
            fullWidth
            variant="outlined"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={campoNaoPreenchido && !nome} // Define erro se campoNaoPreenchido for verdadeiro e nome estiver vazio
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
            error={campoNaoPreenchido && !senha} // Define erro se campoNaoPreenchido for verdadeiro e senha estiver vazia
          />
        </Grid>
        <Grid item>
          {campoNaoPreenchido && (!nome || !senha) && (
            <Typography variant="body2" color="error" style={{margin:10}}>
              Preencha todos os campos.
            </Typography>
          )}
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Entrar
          </Button>
        </Grid>
        <Grid item>
          <Typography align="center">
            Não tem uma conta? <Link component={RouterLink} to="/cadastro">Cadastre-se</Link>
          </Typography>
        </Grid>
      </Grid>
      <ToastContainer />
    </form>
  );
};

export default LoginForm;
