import React, { useState,useEffect } from 'react';
import { Paper, Box, TextField, IconButton, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button, createTheme, ThemeProvider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdicionarUsuarioModal from './Modal/AdicionarUsuarioModal';
import axios from 'axios';
import { ToastContainer  } from 'react-toastify';
import EditUsuarioModal from './Modal/EditModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


const usersData = [
  
];

const desativarUsuario = (id) => {
  axios.post('http://localhost:3333/desativarUsuario', { id })
    .then((response) => {
      toast.success('Usuário desativado com sucesso', {
        autoClose: 2000, 
      });
    })
    .catch((error) => {
      toast.error('Erro aon desativar Usuario', {
        autoClose: 2000, 
      });
      
    });
};

const ativarUsuario = (id) => {
  axios.post('http://localhost:3333/ativarUsuario', { id })
    .then((response) => {
      toast.success('Usuário ativado com sucesso', {
        autoClose: 2000, 
      });
    })
    .catch((error) => {
      toast.error('Erro ao ativar Usuario', {
        autoClose: 2000, 
      });
      
    });
};


function TelaPesquisa() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState(usersData);
  const [editingUser, setEditingUser] = useState(null);
  
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen2(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleOpenModal2 = () => {
    setIsModalOpen2(true);
  }


  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
  }
  
  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:3333/pesquisarUsuario', {
        nome: searchText,
      });

      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao pesquisar usuários:', error);
    }
  }

  useEffect(() => {
    // Fazer a solicitação POST para obter a lista de usuários
    axios.post('http://localhost:3333/listarUsuarios')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Erro ao listar usuários:', error);
      });
  }, []);

  // Configuração do tema escuro (dark theme)
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      text: {
        primary: '#ffffff', // Configura a cor do texto como branco
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Box display="flex" alignItems="center">
        <TextField
  variant="outlined"
  fullWidth
  label="Pesquisar Usuários"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  onKeyPress={(e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }}
  InputProps={{
    endAdornment: (
      <IconButton onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
    ),
  }}
/>
          <IconButton onClick={handleOpenModal}>
            <AddCircleIcon color="primary" />
          </IconButton>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tipo de Usuário</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.tipo_usuario}</TableCell>
                  <TableCell>
                  <IconButton onClick={() => handleOpenEditModal(user)}>
                        <EditIcon />
                    </IconButton>

                    <EditUsuarioModal open={isModalOpen2} onClose={handleCloseModal2} />

                    {user.id !== 1 && (
  <IconButton onClick={() => !user.ativo ? ativarUsuario(user.id) : desativarUsuario(user.id)}>
    {!user.ativo ? (
      <AddCircleOutlineIcon style={{ color: 'green' }} />
    ) : (
      <DeleteIcon style={{ color: 'red' }} />
    )}
  </IconButton>
)}


   </TableCell>
                </TableRow>
                     ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AdicionarUsuarioModal open={isModalOpen} onClose={handleCloseModal} />
        <EditUsuarioModal open={isModalOpen2} onClose={handleCloseModal2} user={editingUser} />

      </Paper>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default TelaPesquisa;
