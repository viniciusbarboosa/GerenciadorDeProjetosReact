import React, { useState,useEffect } from 'react';
import { Typography,TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Grid,Input } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './css/CadastrarCaso.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function CadastrarCasos(props) {
  const [caso, setCaso] = useState({
    nome: '',
    descricao: '',
    prioridade: 'baixa',
    id_relator: props.userData.id || '',
    nome_relator: props.userData.nome || '',
    status: 'aguardando',
    arquivo: null
  });

  useEffect(() => {
    setFilePreview(null);
  }, []);

  const [filePreview, setFilePreview] = useState(null);
  const [hover, setHover] = useState(false);

  const handleFilePreview = (file) => {
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setFilePreview({
        preview: reader.result,
        isImage: file.type.startsWith('image/'),
        extension: file.name.split('.').pop().toLowerCase(),
      });
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }else{
      setFilePreview(null);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'arquivo') {
      const selectedFile = e.target.files[0];
  
      setCaso({
        ...caso,
        [e.target.name]: selectedFile,
      });
  
      handleFilePreview(selectedFile);
    } else {
      const { name, value } = e.target;
      setCaso({
        ...caso,
        [name]: value,
      });
    }
  };

const getFileIcon = (extension) => {
  switch (extension) {
    case 'pdf':
      return <PictureAsPdfIcon className="file-icon" style={{ fontSize: 63 }} />;
    case 'doc':
    case 'docx':
      return <InsertDriveFileIcon className="file-icon" style={{ fontSize: 63 }} />;
    default:
      return null;
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('nome', caso.nome);
    formData.append('descricao', caso.descricao);
    formData.append('prioridade', caso.prioridade);
    formData.append('id_relator', caso.id_relator);
    formData.append('nome_relator', caso.nome_relator);
    formData.append('status', caso.status);

    if (caso.arquivo) {
      formData.append('arquivo', caso.arquivo);
    }

    const response = await axios.post('http://localhost:3333/cadastrarCaso', formData);

    const descricao2 = props.userData.nome.toUpperCase() + " cadastrou um Caso "; 
    const response2 = await axios.post(`http://localhost:3333/adicionarLinhaTempo`, {
      relator: props.userData.id,
      descricao: descricao2
    });

    toast.success('Caso Cadastrado com Sucesso!', { position: toast.POSITION.TOP_CENTER, autoClose: 2000 });

    // Limpar o estado após o envio bem-sucedido
    setCaso((prevCaso) => ({
      ...prevCaso,
      nome: '', // Limpar o nome
      descricao: '', // Limpar a descrição
      prioridade: 'baixa',
      id_relator: props.userData.id || '',
      nome_relator: props.userData.nome || '',
      status: 'aguardando',
      arquivo: null, // Limpar o arquivo
    }));

    caso.nome = '';
    caso.arquivo = null;
    caso.descricao = '';
    caso.prioridade = 'baixa';

    // Limpar a prévia do arquivo
    setFilePreview(null);
  } catch (error) {
    console.error('Erro ao cadastrar o caso:', error);
  }
};




  return (
    <Box sx={{ p: 2, paddingTop: 2 }}> {/* Adicionando espaçamento no topo com paddingTop: 2 unidades */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <AddIcon style={{ fontSize: '28px' }} />
          <span style={{ fontSize: '30px', fontWeight: 'bold',marginLeft: '10px'}}>RELATAR  CASO</span>
        </div>
      <form onSubmit={handleSubmit}>
        <TextField
          name="nome"
          label="Nome do Caso"
          variant="outlined"
          fullWidth
          margin="normal"
          value={caso.nome}
          onChange={handleInputChange}
          required
        />

        {/**descricao antiga*/}
 {/*       <TextField
          name="descricao"
          label="Descrição do Caso"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={caso.descricao}
          onChange={handleInputChange}
          required
        />
  */}

        {/**DESCRICAO NOVA*/}

        <Grid container spacing={2}>
  <Grid item xs={12} style={{ marginTop: '40px' }}>
  <Typography variant="h5" gutterBottom>
      Descrição
    </Typography>
    <ReactQuill
  className="custom-quill-editor"
  value={caso.descricao}
  onChange={(value) => handleInputChange({ target: { name: 'descricao', value } })}
  style={{ marginBottom: '20px', width: '100%', marginTop: '10px' }}
/>
  </Grid>
  <Grid item xs={12} style={{ marginBottom: '40px' }}>
  </Grid>
</Grid>

{/* INPUT DE FILES */}
{filePreview && (
  <div className="file-preview">
    {filePreview.isImage ? (
      <img src={filePreview.preview} alt="Preview" className="preview-image" />
    ) : (
      <span className="preview-icon">{getFileIcon(filePreview.extension)}</span>
    )}
    {filePreview && (
      <Button
      className="remove-file-button"
      variant="outlined"
      onClick={() => {
        setFilePreview(null);
        setCaso({
          ...caso,
          arquivo: null,
        });
      }}
    >
      Remover
    </Button>
    )}
  </div>
)}

<label
  htmlFor="arquivo"
  className={`file-input-label ${filePreview ? 'hidden' : ''} ${hover ? 'hover' : ''}`}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
>
  <CloudUploadIcon className="upload-icon" />
  <Typography variant="body1">Escolher Arquivo</Typography>
</label>

<input
  id="arquivo"
  type="file"
  name="arquivo"
  onChange={handleInputChange}
  accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
  style={{ display: 'none' }}
/>


        <Grid container spacing={2} style={{ marginTop: '40px' }}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Prioridade</InputLabel>
              <Select
                name="prioridade"
                value={caso.prioridade}
                onChange={handleInputChange}
                label="Prioridade"
              >
                <MenuItem value="baixa">Baixa</MenuItem>
                <MenuItem value="media">Média</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={caso.status}
                onChange={handleInputChange}
                label="Status"
                disabled
              >
                <MenuItem value="aguardando">Aguardando</MenuItem>
                <MenuItem value="concluido">Concluído</MenuItem>
                <MenuItem value="em Desenvolvimento">Em Desenvolvimento</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button style={{marginTop:10}} type="submit" variant="contained" color="primary">
            Adicionar Caso
          </Button>
        </Box>
        <ToastContainer />
      </form>
    </Box>
  );
}

export default CadastrarCasos;