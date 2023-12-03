import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, Typography, Paper, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import axios from 'axios';

function VisualizarCasoAprovado(props) {
  const { open, handleClose, caso } = props;

  if (!caso) {
    return null;
  }

  const handleCommitClick = () => {
    if (caso.commit) {
      window.open(caso.commit, '_blank');
    }
  };

  const handleDownload = async () => {
    try {
      // Obtenha o ID do caso
      const casoId = caso.id;

      // Solicite o download do arquivo ao backend
      const response = await axios.post(`http://localhost:3333/downloadArquivo`, { casoId }, { responseType: 'blob' });

      // Crie um link temporário para baixar o arquivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', caso.arquivo);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Visualizar Caso Aprovado
        <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close" sx={{ position: 'absolute', top: 0, right: 15 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form>
          <TextField
            label="Nome do Caso"
            fullWidth
            value={caso.nome}
            InputProps={{
              readOnly: true,
              style: { color: 'black' } // Texto em preto
            }}
            sx={{ marginBottom: 2, marginTop: 2 }} // Espaçamento inferior
          />
       
          <Typography variant="h6" gutterBottom>
            Descrição
          </Typography>
          <ReactQuill
            value={caso.descricao}
            readOnly={true}
            modules={{ toolbar: false }}
            style={{ marginBottom: '20px', width: '100%', marginTop: '10px' }}
          />

          <TextField
            label="Prioridade"
            fullWidth
            value={caso.prioridade}
            InputProps={{
              readOnly: true,
              style: { color: 'black' }
            }}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Nome do Relator"
            fullWidth
            value={caso.nome_relator}
            InputProps={{
              readOnly: true,
              style: { color: 'black' }
            }}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Status"
            fullWidth
            value={caso.status}
            InputProps={{
              readOnly: true,
              style: { color: 'black' }
            }}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Usuário Que Terminou o Caso"
            fullWidth
            value={caso.usuario_trabalhando ? caso.usuario_trabalhando : ''}
            InputProps={{
              readOnly: true,
              style: { color: 'black' }
            }}
            sx={{ marginBottom: 2 }}
          />

{caso.commit && (
  <Paper
    elevation={3}
    style={{
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      },
    }}
    onClick={handleCommitClick}
  >
    <GitHubIcon sx={{ marginRight: '10px', color: 'black' }} />
    <Typography
      variant="body1"
      color="black"
      style={{ whiteSpace: 'pre-wrap', color: 'black' }}
    >
      COMMIT
    </Typography>
  </Paper>
)}


{caso.arquivo && (
  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
    <CloudDownloadIcon style={{ marginRight: '10px' }} />
    <div>
      <Typography variant="h6" gutterBottom>
        Arquivos Extras
      </Typography>
      <Typography>
        Nome: {caso.arquivo}
      </Typography>
    </div>
    <Button
      variant="contained"
      color="primary"
      onClick={handleDownload}
      startIcon={<CloudDownloadIcon />} // Ou outro ícone de download do Material-UI
      style={{ marginLeft: 'auto' }} // Move o botão para a direita
    >
      Baixar
    </Button>
  </div>
)}

        </form>
      </DialogContent>
    </Dialog>
  );
}

export default VisualizarCasoAprovado;
