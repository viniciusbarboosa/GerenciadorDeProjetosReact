import React,{useState,useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField,InputAdornment, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GitHubIcon from '@mui/icons-material/GitHub';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/CadastrarCaso.css';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

function ModalMeuCaso(props) {
  const { open, handleClose, userData, caso } = props;
  const [repositorioCommit, setRepositorioCommit] = useState('');
  const [repositorioCommitValido, setRepositorioCommitValido] = useState(true);

  const handleRepositorioCommitChange = (event) => {
    setRepositorioCommit(event.target.value);
    setRepositorioCommitValido(true);
  };

  useEffect(() => {
    if (caso && caso.commit) {
      setRepositorioCommit(caso.commit);
    }
  }, [caso]);

  useEffect(() => {
    if (!open) {
      setRepositorioCommit('');
    }
  }, [open]);

  if (!caso) {
    return null;
  }

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
  //METODO ANTIGO DE PASSSAR REQ , VEJA UM NOVO COM APENAS UMA FUNCTION DPS
  const atualizarCasoNoServidor = async (casoId, userId, userName) => {
    try {
      const response = await axios.post(`http://localhost:3333/atribuirCasoMeuUser`, {
        userId: userId,
        nomeUsuario: userName,
        casoId: casoId, 
      });

      const descricao2 = userName.toUpperCase() + "  atribuiu caso a ele mesmo "; 
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

  

  const atualizarCasoNoServidorConcluido = async (casoId, userId, userName) => {
    try {

      const response3 = await axios.post('http://localhost:3333/atualizarCommit', {
        casoId: casoId,
        novoCommit: repositorioCommit,
      });

      const response = await axios.post(`http://localhost:3333/concluirCaso`, {
        userId: userId,
        nomeUsuario: userName,
        casoId: casoId, 
      });

      const descricao2 = userName.toUpperCase() + "  marcou um caso como concluido "; 
      const response2 = await axios.post(`http://localhost:3333/adicionarLinhaTempo`, {
        relator: userId,
        descricao: descricao2
      });

      toast.success('Caso Concluido com sucesso  !', {
        position: 'top-right',
        autoClose: 3000, 
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleConcluir = async () => {

      if ((repositorioCommit.includes(props.configProjeto.repositorio)||repositorioCommit==='')){
        await atualizarCasoNoServidorConcluido(caso.id, userData.id, userData.nome);
        handleClose();
      }else{
        console.log(props.configProjeto.repositorio);
        console.log(repositorioCommit);
        setRepositorioCommitValido(false)
        return;
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



{caso.status !== 'concluido' && props.configProjeto.repositorio !== '' && props.configProjeto.repositorio !== null ? (
  <div>
    <TextField
      label="Repositório do Commit"
      fullWidth
      value={repositorioCommit}
      onChange={handleRepositorioCommitChange}
      InputProps={{
        style: { color: repositorioCommitValido ? 'black' : 'red' },
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              edge="start"
              color="inherit"
              style={{ padding: 0, marginLeft: 1 }}
            >
              <GitHubIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ marginBottom: 2 }}
      error={!repositorioCommitValido}
    />
    {!repositorioCommitValido && (
      <Typography variant="caption" color="error">
        Repositório do commit inválido
      </Typography>
    )}
  </div>
) : null}


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
        {caso.status === "concluido" ? (
  <Button onClick={handleAtribuir} color="primary">
    Atribuir
  </Button>
) : (
  <Button onClick={handleConcluir} color="primary">
    Concluir
  </Button>
)}
      </DialogActions>
      
    </Dialog>
  );
}

export default ModalMeuCaso;
