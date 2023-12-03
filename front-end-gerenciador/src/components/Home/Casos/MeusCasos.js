import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Grid, Box, Chip, Paper } from '@mui/material';
import axios from 'axios';
import ModalMeuCaso from './Modal/ModalMeuCaso';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentIcon from '@mui/icons-material/Assignment';

function MeusCasos(props) {
  const { userData } = props;
  const [casos, setCasos] = useState([]);
  const [linhaDoTempoEventos, setLinhaDoTempoEventos] = useState([]);
  //MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [casoSelecionado, setCasoSelecionado] = useState(null);

  const abrirModal = (caso) => {
    setCasoSelecionado(caso);
    setModalOpen(true);
  };

  const openModal = (caso) => {
    setCasoSelecionado(caso);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCasoSelecionado(null);
    setModalOpen(false);
  };

  
  useEffect(() => {
    const idUsuarioTrabalhando = props.userData.id;


    axios.post(`http://localhost:3333/meusCasos`, { id_usuario_trabalhando: idUsuarioTrabalhando })
      .then(response => {
        setCasos(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar casos:', error);
      });

    axios.post(`http://localhost:3333/pegarLinhaTempoRelator`, { relator: idUsuarioTrabalhando })
      .then(response => {
        setLinhaDoTempoEventos(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar eventos da linha do tempo:', error);
      });
  }, [props.userData.id]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <AssignmentIcon style={{ fontSize: '28px' }} />
          <span style={{ fontSize: '30px', fontWeight: 'bold',marginLeft: '10px'}}>MEUS  CASOS</span>
        </div>

      <Grid container spacing={3}>
        <Grid item xs={7}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold'}}>Casos</span>
        </div>
          {casos.map((caso, index) => (
            <div key={caso.id} onClick={() => abrirModal(caso)} style={{ marginTop: '20px', cursor: 'pointer' }}>
            <Paper key={index} elevation={3} style={{ marginBottom: '16px' }}>
              <CardContent>
                <Typography variant="h6">{caso.nome}</Typography>
                <Typography variant="body2">NUMERO DO CASO: {caso.id}</Typography>
                <Typography variant="body2">Relator: {caso.nome_relator}</Typography>
                <Box mt={2}>
                  <Chip
                    label={caso.status === 'concluido' ? 'Concluído' : 'Em Desenvolvimento'}
                    color={caso.status === 'concluido' ? 'success' : 'primary'}
                  />
                </Box>
              </CardContent>
            </Paper>
            </div>
          ))}
        </Grid>

        <Grid item xs={5}>
        <Paper elevation={3} style={{ padding: '15px' }}>
          <Typography variant="h6" gutterBottom>
            Minha Linha do Tempo
          </Typography>
          </Paper>
          <List>
          {linhaDoTempoEventos.length > 0 ? (
            <List>
              {linhaDoTempoEventos.slice(-10).map((evento, index) => (
                <Box key={index} mb={2}>
                  <Paper elevation={3} style={{ padding: '10px' }}>
                    <ListItem>
                      <ListItemText primary={evento.descricao} secondary={``} />
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
      <ModalMeuCaso
  open={modalOpen}
  handleClose={closeModal}
  caso={casoSelecionado}
  userData={userData}
  configProjeto={props.configProjeto}
/>
<ToastContainer />
      <ToastContainer />
    </div>
  );
}

export default MeusCasos;
