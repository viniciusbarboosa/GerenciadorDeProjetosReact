import React, { useState } from 'react';
import { Modal, Button, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const tiposUsuario = [
  { value: 'dev', label: 'Desenvolvedor' },
  { value: 'adm', label: 'Administrador' },
  { value: 'analista', label: 'Analista' },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'black',
  padding: '20px',
  width: '400px',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  color: 'white',
  fontSize: '24px',
};

const buttonStyle = {
  background: 'none',
  color: '#0077cc',
};

function AdicionarUsuarioModal({ open, onClose }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(tiposUsuario[0]);
  const [senhaErro, setSenhaErro] = useState(false);
  const [confirmarSenhaErro, setConfirmarSenhaErro] = useState(false);
  const [nomeErro, setNomeErro] = useState(false);
  const [emailErro, setEmailErro] = useState(false);

  const handleClose = () => {
    // Limpa os campos e erros
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setTipoUsuario(tiposUsuario[0]); // Redefina o tipo de usuário para "Desenvolvedor"
    setNomeErro(false);
    setEmailErro(false);
    setSenhaErro(false);
    setConfirmarSenhaErro(false);
    onClose();
  }

  const handleAdicionarUsuario = async() => {
    if (!nome || !email || !tipoUsuario) {
      setNomeErro(!nome);
      setEmailErro(!email);
      setSenhaErro(false);
      setConfirmarSenhaErro(false);
      return;
    }

    if (!senha) {
      setSenhaErro(true);
      return;
    }

    if (senha !== confirmarSenha) {
      setSenhaErro(true);
      setConfirmarSenhaErro(true);
      return;
    }

    setNomeErro(false);
    setEmailErro(false);
    setSenhaErro(false);
    setConfirmarSenhaErro(false);

    const novoUsuario = {
      nome,
      email,
      senha,
      tipo_usuario: tipoUsuario.value,
    };

    // Implemente a lógica para adicionar o usuário no banco de dados ou onde quer que seja necessário.

    try {
      await axios.post('http://localhost:3333/cadastrar', {
        nome,
        email,
        senha,
        tipo_usuario: tipoUsuario.value, 
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


    setNome('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setTipoUsuario(tiposUsuario[0]);

    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle}>
        <Button onClick={handleClose} style={closeButtonStyle}>
          X
        </Button>
        <h2 style={{ color: 'white' }}>Adicionar Usuário</h2>
        <form>
          <Autocomplete
            options={tiposUsuario}
            getOptionLabel={(option) => option.label}
            value={tipoUsuario}
            onChange={(event, newValue) => {
              setTipoUsuario(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Tipo de Usuário" fullWidth sx={{ marginTop: 2 }} />}
            clearIcon={null}
          />
          <TextField
            label="Nome"
            fullWidth
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setNomeErro(false); // Limpe o erro de nome ao alterar o campo
            }}
            sx={{ marginTop: 2 }}
            error={nomeErro}
          />
          {nomeErro && <Typography variant="caption" color="error">Preencha o nome.</Typography>}
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailErro(false); // Limpe o erro de email ao alterar o campo
            }}
            sx={{ marginTop: 2 }}
            error={emailErro}
          />
          {emailErro && <Typography variant="caption" color="error">Preencha o email</Typography>}
          <TextField
            label="Senha"
            fullWidth
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setSenhaErro(false); // Limpe o erro de senha ao alterar o campo
            }}
            sx={{ marginTop: 2 }}
            error={senhaErro}
          />
          {senhaErro && <Typography variant="caption" color="error">Preencha a senha.</Typography>}
          <TextField
            label="Confirmar Senha"
            fullWidth
            type="password"
            value={confirmarSenha}
            onChange={(e) => {
              setConfirmarSenha(e.target.value);
              setSenhaErro(false);
              setConfirmarSenhaErro(false); // Limpe os erros de senha ao alterar o campo
            }}
            sx={{ marginTop: 2 }}
            error={confirmarSenhaErro}
          />
          {senhaErro && confirmarSenhaErro && <Typography variant="caption" color="error">As senhas não coincidem.</Typography>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button sx={{ ...buttonStyle }} onClick={handleClose}>
              Fechar
            </Button>
            <Button sx={{ marginRight: 2, ...buttonStyle }} onClick={handleAdicionarUsuario}>
              Adicionar
            </Button>
          </Box>
        </form>
      </div>
    </Modal>
  );
}

export default AdicionarUsuarioModal;
