import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField,Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/CadastrarCaso.css';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';


function ModalAtribuirCaso(props) {
  const { open, handleClose, userData, caso } = props;

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

  if (!caso) {
    return null;
  }

  //METODO ANTIGO DE PASSSAR REQ , VEJA UM NOVO COM APENAS UMA FUNCTION DPS
  const atualizarCasoNoServidor = async (casoId, userId, userName) => {
    try {
      const response = await axios.post(`http://localhost:3333/atribuirCasoMeuUser`, {
        userId: userId,
        nomeUsuario: userName,
        casoId: casoId, 
      });

      const descricao2 = userName.toUpperCase() + " atribuiu o Caso a ele mesmo "; 
      const response2 = await axios.post(`http://localhost:3333/adicionarLinhaTempo`, {
        relator: userId,
        descricao: descricao2
      });

      toast.success('Caso Atribuido a mim com sucesso  !', {
        position: 'top-right',
        autoClose: 3000, 
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAtribuir = async () => {
    try {
      await atualizarCasoNoServidor(caso.id, userData.id, userData.nome);
      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar o caso:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Atribuir Caso
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
  label="Usuário Trabalhando"
  fullWidth
  value={caso.usuario_trabalhando ? caso.usuario_trabalhando : 'Ainda não sendo feito'}
  InputProps={{
    readOnly: true,
    style: { color: 'black' }
  }}
  sx={{ marginBottom: 2 }}
/>


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
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Fechar
        </Button>
        <Button onClick={handleAtribuir} color="primary">
          Atribuir
        </Button>
      </DialogActions>
      
    </Dialog>
  );
}

export default ModalAtribuirCaso;
