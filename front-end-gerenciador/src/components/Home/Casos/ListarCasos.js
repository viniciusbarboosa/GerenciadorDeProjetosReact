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
import ModalAtribuirCaso from './Modal/ModalAtribuirCaso';
import { ToastContainer  } from 'react-toastify';

const ListarCasos = (props) => {
  const { userData } = props;
  const [searchText, setSearchText] = useState('');
  const [casos, setCasos] = useState([]);
  const [linhaDoTempoEventos, setLinhaDoTempoEventos] = useState([]);
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
    axios.get('http://localhost:3333/listarCasos') 
      .then((response) => {
        setCasos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao listar casos:', error);
      });

      axios.post(`http://localhost:3333/pegarLinhaTempo`)
      .then(response => {
        setLinhaDoTempoEventos(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar eventos da linha do tempo:', error);
      });
  }, []);


  const handleSearch = () => {
    axios.get('http://localhost:3333/pesquisarCasos', { params: { searchText } })
    .then((response) => {
      // Atualize a lista de casos com os resultados da pesquisa
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Box display="flex" alignItems="center">
              <Avatar alt={userData.nome.toUpperCase()} src="/caminho-para-foto-de-usuario.jpg" style={{ width: 50, height: 50, margin: '10px' }} />
              <Typography style={{ marginRight: '20px' }} variant="subtitle1">{userData.nome}</Typography>
              <TextField
                variant="outlined"
                fullWidth
                label="Pesquisar Casos"
                onKeyPress={handleSearchEnter}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Box>
          </Paper>

          

          <List style={{ marginTop: '20px', cursor: 'pointer' }}>
      {casos.map((caso) => (
        <div key={caso.id} onClick={() => abrirModal(caso)}>
          <ListItem >
            <Avatar
              style={{
                backgroundColor:
                  caso.status === 'desenvolvido' ? 'green':
                  caso.prioridade === 'alta' ? 'red' :
                  caso.prioridade === 'media' ? 'orange' :
                  caso.prioridade === 'baixa' ? 'blue' : 'gray',
                marginRight: '10px',
                width: '40px',
                height: '40px',
              }}
            >
              {caso.status.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText
              primary={caso.nome}
              secondary={`Número do Caso: ${caso.id}`}
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

        <Grid item xs={6}>
          <Paper elevation={3} style={{ marginTop: '20px', padding: '20px' }}>
            <Typography variant="h6">Linha do Tempo</Typography>
          </Paper>
          <List>
          {linhaDoTempoEventos.length > 0 ? (
            <List>
              {linhaDoTempoEventos.slice(-10).map((evento, index) => (
                <Box key={index} mb={2}>
                  <Paper elevation={3} style={{ padding: '10px' }}>
                    <ListItem>
                      <ListItemText primary={evento.descricao} secondary={`Relator: ${evento.relator}`} />
                    </ListItem>
                  </Paper>
                </Box>
              ))}
            </List>
          ) : (
            <Paper elevation={3} style={{ padding: '10px' }}>
            <Typography variant="body1" style={{color:'red'}}>Sem eventos na sua linha do tempo.</Typography>
            </Paper>
          )}
          </List>
        </Grid>
      </Grid>
      <ModalAtribuirCaso
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
