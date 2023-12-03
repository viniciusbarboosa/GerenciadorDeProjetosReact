import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Autocomplete, Box, Typography } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

function EditModal({ open, onClose, user }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(tiposUsuario[0]);

  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setEmail(user.email || '');
      setTipoUsuario(tiposUsuario.find((tipo) => tipo.value === user.tipo_usuario) || tiposUsuario[0]);
    } else {
      // Se o usuário for nulo, defina os campos como null ou vazios.
      setNome('');
      setEmail('');
      setTipoUsuario(tiposUsuario[0]);
    }
  }, [user]);

  const handleClose = () => {
    //setNome('');
    //setEmail('');
    //setTipoUsuario(tiposUsuario[0]);
    onClose();
  }

  const handleEditarUsuario = async () => {
    if (!user || !nome || !email || !tipoUsuario) {
      return;
    }
  
    const usuarioEditado = {
      id: user.id, 
      nome,
      email,
      tipo_usuario: tipoUsuario.value,
    };
  
    try {
      // Implemente a lógica de envio da solicitação de edição usando axios.
      await axios.post('http://localhost:3333/atualizarUsuario', usuarioEditado);
  
      // Lógica de sucesso
      toast.success('Usuário editado com sucesso', {
        autoClose: 2000,
      });
  
      // Feche o modal
      handleClose();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(' ' + error.response.data.error, {
          autoClose: 2000,
        });
      } else {
        console.error(error);
      }
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle}>
        <Button onClick={handleClose} style={closeButtonStyle}>
          X
        </Button>
        <h2 style={{ color: 'white' }}>Editar Usuário</h2>
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
            onChange={(e) => setNome(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button sx={{ ...buttonStyle }} onClick={handleClose}>
              Fechar
            </Button>
            <Button sx={{ marginRight: 2, ...buttonStyle }} onClick={handleEditarUsuario}>
              Editar
            </Button>
          </Box>
        </form>
      </div>
    </Modal>
  );
}

export default EditModal;
