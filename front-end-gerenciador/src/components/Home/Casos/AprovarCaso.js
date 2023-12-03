import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AprovarCaso from './Modal/AprovarCaso';
import { ToastContainer  } from 'react-toastify';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const ListarCasos = (props) => {
  const { userData } = props;
  const [searchText, setSearchText] = useState('');
  const [casos, setCasos] = useState([]);
  //MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [casoSelecionado, setCasoSelecionado] = useState(null);

  const openModal = (caso) => {
    setCasoSelecionado(caso);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCasoSelecionado(null);
    setModalOpen(false);
  };

  const abrirModal = (caso) => {
    setCasoSelecionado(caso);
    setModalOpen(true);
  };

  useEffect(() => {
    axios.post('http://localhost:3333/CasosConcluidos') 
      .then((response) => {
        setCasos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao listar casos:', error);
      });
  }, []);

  const handleSearch = () => {
    axios.get('http://localhost:3333/pesquisarCasos', { params: { searchText } })
    .then((response) => {
      setCasos(response.data);
    })
    .catch((error) => {
      console.error('Erro ao pesquisar casos:', error);
    });
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container>


<div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <ThumbUpIcon style={{ fontSize: '28px' }} />
          <span style={{ fontSize: '30px', fontWeight: 'bold',marginLeft: '15px'}}>APROVAR CASOS</span>
        </div>


      <Grid container spacing={2}>
        <Grid item xs={9}>
          <List style={{ marginTop: '20px', cursor: 'pointer' }}>
      {casos.map((caso) => (
        <div key={caso.id} onClick={() => abrirModal(caso)}>
          <ListItem >
            <Avatar
              style={{
                backgroundColor:'green',
                marginRight: '10px',
                width: '40px',
                height: '40px',
              }}
            >
              {caso.status.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText
              primary={caso.nome}
              secondary={`NUMERO DO CASO: ${caso.id}`}
            />
            <div
              style={{
                width: '32px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              
              <div style={{
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: caso.prioridade === 'alta' ? 'red' :
    (caso.prioridade === 'media' ? 'orange' : 'blue')
}} />


            </div>
          </ListItem>
          <Divider />
        </div>
      ))}
    </List>




        </Grid>
      </Grid>
      < AprovarCaso
  open={modalOpen}
  handleClose={closeModal}
  caso={casoSelecionado}
  userData={userData}
/>
<ToastContainer />
    </Container>
  );
};

export default ListarCasos;
