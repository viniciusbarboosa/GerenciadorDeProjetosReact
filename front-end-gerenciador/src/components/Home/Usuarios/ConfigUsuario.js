import React, { useState,useEffect } from "react";
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import SettingsIcon from '@mui/icons-material/Settings';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GitHubIcon from '@mui/icons-material/GitHub';
import InputMask from 'react-input-mask';

const ConfigUsuario = (props) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo_usuario,setTipoUsuario] = useState('');
  const [numero,setNumero] = useState('');
  const [gitHub,setGitHub] = useState('');
  const [senhaErro, setSenhaErro] = useState(false);
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [numeroErro, setNumeroErro] = useState(false);

  useEffect(() => {
    if (props.userData) {
        setNome(props.userData.nome || '');
        setEmail(props.userData.email || '');
        setSenha(props.userData.senha || '');
        setTipoUsuario(props.userData.tipo_usuario || '');
        setNumero(props.userData.numero || '');
        setGitHub(props.userData.github || '');
      } else {
        setNome('');
        setEmail('');
        setSenha('');
        setTipoUsuario('');
        setNumero('');
        setGitHub('');
    }
}, [props.userData]);


  const handleChangeNumero = (e) => {
    setNumero(e.target.value);
    setNumeroErro(false);
  };

  const handleChangeConfirmarSenha = (e) => {
    setConfirmarSenha(e.target.value);
    setSenhaErro(false);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
   
    if (senha !== confirmarSenha) {
      setSenhaErro(true);
      return
    } else {
      setSenhaErro(false);
    }

    if(numero != ''){
      if (!numero || !/^\(\d{2}\) 9 \d{4}-\d{4}$/.test(numero)) {
        setNumeroErro(true);
        return;
      }else {
        setNumeroErro(false);
      }
    }

    const userId = props.userData.id; 
    const updatedUserData = {
        nome,
        email,
        senha,
        tipo_usuario,
        numero,
        gitHub
    };

    axios.post('http://localhost:3333/atualizarUsuario', { id: props.userData.id, ...updatedUserData })
    .then(response => {
      toast.success('Usuário editado com sucesso o Sistema vai REINICAR', {
        autoClose: 2000,
      });
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/login'; 
      }, 2500);
    })
    .catch(error => {
      if (error.response && error.response.status === 400) {
        toast.error('O email ja está em uso.', {
          autoClose: 5000,
        });
      } else {
        console.error(error.response ? error.response.data.error : 'Erro desconhecido');
      }
    });

  };

  return (
    <Box sx={{ p: 2, paddingTop: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <SettingsIcon style={{ fontSize: '28px' }} />
          <span style={{ fontSize: '30px', fontWeight: 'bold' }}>&nbsp; Configurações de Usuário</span>
        </div>
      <form onSubmit={handleSubmit}>


        <TextField
        helperText={numeroErro ? 'Número inválido' : ''}
          name="nome"
          label="Nome do Usuário"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          InputProps={{ readOnly: true }}
        />


        <TextField
          name="email"
          label="E-mail"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <TextField
          name="senha"
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />


        <TextField
          name="confirmarSenha"
          label="Confirmar Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          error={senhaErro}
          helperText={senhaErro ? 'Senhas não coincidem' : ''}
          value={confirmarSenha}
          onChange={handleChangeConfirmarSenha}
        />


         <TextField
              name="tipoUsuario"
              label="Tipo de Usuário"
              variant="outlined"
              fullWidth
              margin="normal"
              value={tipo_usuario}
              InputProps={{ readOnly: true }}
            />






<InputMask
          mask="(99) 9 9999-9999"
          value={numero}
          onChange={handleChangeNumero}
        >
          {() => (
            <TextField
              name="numero"
              label="Número (WhatsApp)"
              variant="outlined"
              fullWidth
              margin="normal"
              error={numeroErro}
              helperText={numeroErro ? 'Número inválido' : ''}
              InputProps={{
                startAdornment: (
                  <WhatsAppIcon style={{ marginRight: '10px', color: '#25D366' }} />
                ),
              }}
            />
          )}
        </InputMask>



        {props.configProjeto.repositorio !== '' && props.configProjeto.repositorio !== null ? (

        <TextField
          name="gitHub"
          label="GitHub"
          variant="outlined"
          fullWidth
          margin="normal"
          value={gitHub}
          onChange={(e) => setGitHub(e.target.value)}
          InputProps={{
            startAdornment: (
              <GitHubIcon style={{ marginRight: '10px', color: '#333' }} />
            ),
          }}
        />
        ): null}

        <Box sx={{ marginTop: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Atualizar Configurações
          </Button>
        </Box>
      </form>
      <ToastContainer />
    </Box>
  );
}

export default ConfigUsuario;
