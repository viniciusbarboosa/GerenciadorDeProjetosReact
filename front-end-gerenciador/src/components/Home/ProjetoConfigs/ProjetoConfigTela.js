import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProjetoConfigTela(props) {
  const navigate = useNavigate();
  const [configProjeto, setConfigProjeto] = useState(props.configProjeto || {});
  const [nomeProjeto, setNomeProjeto] = useState('');
  const [repositorio, setRepositorio] = useState('');
  const [repositorioError, setRepositorioError] = useState('');

  useEffect(() => {
    if (props.configProjeto) {
      const { nome_projeto, repositorio } = props.configProjeto;
      setNomeProjeto(nome_projeto || '');
      setRepositorio(repositorio || '');
    }
  }, [props.configProjeto]);

  const handleNomeChange = (e) => {
    setNomeProjeto(e.target.value);
  };

  const handleRepositorioChange = (e) => {
    setRepositorio(e.target.value);
    setRepositorioError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const githubUrlPattern = /https:\/\/github\.com\/([\w-]+)\/([\w-]+)/;
    if (repositorio && !repositorio.match(githubUrlPattern)) {
      setRepositorioError('Repositório inválido');
      return;
    }
   
    try {
      if(repositorio != ''){
      const [, owner, repo] = repositorio.match(/github\.com\/([^/]+)\/([^/]+)$/);
      const responseGit = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
      }
      const response = await axios.post('http://localhost:3333/atualizarConfig', {
        nome_projeto: nomeProjeto,
        repositorio: repositorio,
      });

      if (response.status === 200) {
        console.log('Configurações do projeto foram atualizadas com sucesso.');
        toast.success('Configurações atualizadas!', { position: toast.POSITION.TOP_CENTER, autoClose: 2000 }); 
        setTimeout(() => {
            window.location.reload();
          }, 2100);
      } else {
        console.error('Erro ao atualizar as configurações do projeto.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setRepositorioError('Repositório não encontrado');
      } else {
        setRepositorioError('Repositório não encontrado');
        console.error('Erro ao fazer a solicitação para validar o repositório:', error);
      }
    
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <AssignmentIcon style={{ fontSize: '28px' }} />
          <span style={{ fontSize: '30px', fontWeight: 'bold' }}>&nbsp; Configurações do Projeto</span>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Nome do Projeto"
            variant="outlined"
            fullWidth
            value={nomeProjeto}
            onChange={handleNomeChange}
            InputProps={{
              startAdornment: (
                <PersonIcon style={{ marginRight: '8px' }} />
              ),
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <TextField
            label="Repositório"
            variant="outlined"
            fullWidth
            value={repositorio}
            onChange={handleRepositorioChange}
            InputProps={{
              startAdornment: (
                <GitHubIcon style={{ marginRight: '8px' }} />
              ),
            }}
            error={!!repositorioError}
            helperText={repositorioError}
          />
        </div>
        <Button type="submit" variant="contained" color="primary">
          Atualizar
        </Button>
      </form>
      <ToastContainer />
    </Container>
  );
}

export default ProjetoConfigTela;
