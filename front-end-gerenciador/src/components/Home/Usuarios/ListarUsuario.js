import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Paper,
  Typography,
  Avatar,
  Box,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(Paper)({
  position: 'absolute',
  width: 1000,
  maxWidth: '80%',
  maxHeight: '80%',
  padding: '20px',
  outline: 'none',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
});

const ChatContainer = styled(Box)({
  height: '300px',
  overflowY: 'scroll',
  padding: '10px',
});

const MessageInputContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginTop: '10px',
});

const MessageInput = styled('input')({
  flex: 1,
  marginLeft: '10px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: '10px',
  right: '10px',
});

const ModalHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  borderBottom: '1px solid #ccc',
  paddingBottom: '10px',
  borderRadius: '10px 10px 0 0',
  padding: '10px',
});

const ModalBody = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  marginBottom: '20px',
  padding: '10px',
  background: '#e0e0e0',
  borderRadius: '0 0 10px 10px',
});

const ModalAvatar = styled(Box)(({ remetenteLocal }) => ({
  marginRight: remetenteLocal ? 0 : '10px',
  marginLeft: remetenteLocal ? '10px' : 0, 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px', 
  height: '30px', 
  borderRadius: '50%', 
  backgroundColor: remetenteLocal ? 'red' : 'green',
  color: 'white', 
  fontWeight: 'bold',
}));

const ModalMessageBox = styled(Box)(({ remetenteLocal, novaMensagem }) => ({
  alignSelf: remetenteLocal ? 'flex-start' : 'flex-end', 
  backgroundColor: remetenteLocal ? '#2196F3' : '#E0E0E0',
  color: remetenteLocal ? 'white' : 'black',
  borderRadius: '8px',
  padding: '8px',
  maxWidth: '70%',
  wordWrap: 'break-word',
  marginBottom: '10px', 
  marginLeft: remetenteLocal ? '0' : '5px', 
  marginRight: remetenteLocal ? '5px' : '0', 
  backgroundColor: novaMensagem ? 'red' : remetenteLocal ? '#2196F3' : '#E0E0E0',
}));


const socket = io('http://localhost:3334', {
  transports: ['websocket'],
});

const mensagensGlobais = [];

const ListarUsuario = (props) => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState([...mensagensGlobais]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3333/listarUsuarioForaMeuUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idDoUsuarioLogado: props.userData.id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.error('Erro ao obter a lista de usuários');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };

    fetchData();
  }, [props.userData.id]);

  useEffect(() => {
    socket.connect();

    socket.on('novaMensagem', (mensagem) => {
      if (usuarioSelecionado && mensagem.remetente === usuarioSelecionado.nome) {
        setMensagens([...mensagens, { ...mensagem, remetenteLocal: true }]);
      } else {
        setMensagensNaoLidas((prev) => prev + 1);
      }
    });


    return () => {
      socket.disconnect();
    };
  }, [mensagens, usuarioSelecionado]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && mensagem.trim()) {
      enviarMensagem(usuarioSelecionado.id, props.userData.id);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  

  const abrirModalChat = async (usuario) => {
    setUsuarioSelecionado(usuario);
    setModalAberta(true);
    setMensagensNaoLidas(0);

    try {
      const response = await axios.post('http://localhost:3333/obterPorUsuario', {
        userId: props.userData.id,
        paraUsuario: usuario.id,
      });
  
      if (response.data) {
        setMensagens(response.data);
      } else {
        console.error('Erro ao obter mensagens do banco de dados');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const fecharModalChat = () => {
    setModalAberta(false);
    localStorage.setItem('mensagens', JSON.stringify(mensagens));
  };


  const enviarMensagem = async (paraUsuario, de) => {
    const novaMensagem = {
      remetente: props.userData.nome,
      texto: mensagem,
      userId: props.userData.id,
      remetenteLocal: true,
      paraUsuario,
      de,
    };
  
    // Atualizar o estado local
    setMensagens([...mensagens, novaMensagem]);
  
    try {
      const response = await axios.post('http://localhost:3333/enviar', novaMensagem);
  
      if (!response.data) {
        console.error('Erro ao salvar mensagem no banco de dados');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }

    socket.emit('enviarMensagem', novaMensagem);
  
    setMensagem('');
  };


  const abrirAlerta = (nome) => {
    const email = nome;
    const assunto = 'Ola é sobre o  projeto';
    const corpoDoEmail = '';

    const link = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpoDoEmail)}`;

    window.open(link, '_blank');
  };

  const abrirAlertaGitHub = (nome) => {
    window.open('https://github.com/'+nome, "_blank");
  };

  const abrirAlertaWhats = (nome) => {
    const numeroLimpo = nome.replace(/\D/g, '');
    window.open('https://wa.me/55'+numeroLimpo, "_blank");
  };


  return (
    <div>

<div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <ChatIcon style={{ fontSize: '28px' }} />
          <span style={{ fontSize: '30px', fontWeight: 'bold',marginLeft: '15px'}}> USUARIOS</span>
        </div>

      <List>
        {usuarios.map((usuario) => (
          <ListItem key={usuario.id} button onClick={() => abrirModalChat(usuario)}>
            <ListItemAvatar>
              <Avatar>{usuario.nome.charAt(0).toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={usuario.nome}
              secondary={
                <React.Fragment>
                  <Typography variant="body2" color="text.primary">
                    {usuario.email}
                  </Typography>
                </React.Fragment>
              }
            />
            <Box display="flex" alignItems="center">
            {usuario.github && (
                <Button startIcon={<GitHubIcon />} onClick={(e) => { e.stopPropagation(); abrirAlertaGitHub(usuario.github)}}>
                  GitHub
                </Button>
              )}
              {usuario.numero && (
                <Button startIcon={<WhatsAppIcon />} onClick={(e) => { e.stopPropagation(); abrirAlertaWhats(usuario.numero); }}>
                  WhatsApp
                </Button>
              )}
              <Button startIcon={<EmailIcon />} onClick={(e) => { e.stopPropagation(); abrirAlerta('Email'); }}>
                Email
              </Button>
            </Box>
            {usuario.mensagensNaoLidas > 0 && (
              <Typography variant="body2" style={{ color: 'red', marginLeft: '10px' }}>
                {usuario.mensagensNaoLidas} nova(s) mensagem(ns)
              </Typography>
            )}
          </ListItem>
        ))}
      </List>

      {/* Modal de Chat */}
      <StyledModal open={modalAberta} onClose={fecharModalChat}>
        <ModalContent>
          <CloseButton onClick={fecharModalChat}>
            <CloseIcon />
          </CloseButton>
          <ModalHeader>
            <Typography variant="h5">{usuarioSelecionado && usuarioSelecionado.nome}</Typography>
          </ModalHeader>

          <ModalBody>
            <ChatContainer>
            
            {
            
            mensagens.filter(
    (mensagem) => 
    (
    (mensagem.paraUsuario === usuarioSelecionado.id) &&
    (mensagem.de === props.userData.id)) ||  
    (
      (mensagem.paraUsuario === props.userData.id ) &&
      (mensagem.de === usuarioSelecionado.id)) 
      ).map((mensagem, index) => (
               <Box
               key={index}
               display="flex"
               alignItems="center"
               justifyContent={
                 mensagem.remetente === props.userData.nome ? 'flex-end' : 'flex-start'
               }
               mb={1}
             >
               <ModalAvatar alt="Avatar">
                 {mensagem.remetente.charAt(0).toUpperCase()}
               </ModalAvatar>
               
           
               <ModalMessageBox remetenteLocal={mensagem.remetenteLocal}>
                 {mensagem.texto}
               </ModalMessageBox>
             </Box>
              ))}
              <div ref={messagesEndRef} />
            </ChatContainer>
          </ModalBody>

          <MessageInputContainer>
            <MessageInput
              placeholder="Digite sua mensagem..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={() => enviarMensagem(usuarioSelecionado.id,props.userData.id)} variant="contained" color="primary" disabled={!mensagem.trim()}>
              Enviar
            </Button>

           
          </MessageInputContainer>
        </ModalContent>
      </StyledModal>
    </div>
  );
};

export default ListarUsuario;
