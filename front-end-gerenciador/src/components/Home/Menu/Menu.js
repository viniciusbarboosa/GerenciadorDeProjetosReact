import * as React from 'react';
import axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { BarChart, SupervisorAccount } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { CheckCircle } from "@mui/icons-material";
import ChatIcon from '@mui/icons-material/Chat';

//MINHAS TELAS
import MeusCasos from '../Casos/MeusCasos';
import CadastrarCasos from '../Casos/CadastrarCasos';
import ListarCasos from '../Casos/ListarCasos';
import ListarUsuarioAdm from '../Usuarios/ListarUsuarioAdm';
import ProjetoConfigTela from '../ProjetoConfigs/ProjetoConfigTela';
import AprovarCaso from '../Casos/AprovarCaso';
import ConfigUsuario from '../Usuarios/ConfigUsuario';
import EstatisticaCaso from '../Casos/EstatisticasCaso';
import Commits from '../ProjetoConfigs/Commits';
import CasosAprovados from '../Casos/CasosAprovados';
import ListarUsuario from '../Usuarios/ListarUsuario';

import { Container } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'

import CustomMenu from './components/CustomMenu';



const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


export default function Menu(props) {
    
    //MENU 
    console.log(props);
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    //MINHAS ALTERAÇOES
    //COLOCAR PAGINAS AQUI
    const navigate = useNavigate();
    const userData = props.userData;
    const [visivel, setVisivel] = React.useState(1);
    const [configProjeto, setConfigProjeto] = useState({});

    const handleLogout = () => {
        // Redirecionar para a página de login sem passar dados de usuário
        navigate('/login');
    }

    //SETERS E REQUISIÇÕES
    useEffect(() => {
        if (!userData) {
            navigate('/login');
        }
    }, [navigate, userData]);

    useEffect(() => {
        axios.post('http://localhost:3333/listarProjetoConfig')
          .then(response => {
            setConfigProjeto(response.data);
          })
          .catch(error => {
            console.error('Erro na requisição:', error);
          });
      }, []);

    if (!userData) {
        return null;
    }

    function seletorDeComponente() {
        if (visivel === 1) {
            return <MeusCasos userData={props.userData} texto={"Cadastro de produtos"} configProjeto={configProjeto} />
        } else if (visivel === 2) {
            return <CadastrarCasos userData={props.userData} texto={"Cadastro de casos"} />
        }else if (visivel === 3) {
            return <ListarCasos userData={props.userData} texto={"Listar Casos"}/>
        }else if (visivel === 4) {
            return <ListarUsuarioAdm userData={props.userData} texto={"Listar Usuarios ADMIN"}/>
        }else if(visivel === 5){
            return <ProjetoConfigTela configProjeto={configProjeto} userData={props.userData} texto={"cONFIGURAÇOES DO PROJETO"}/>
        }else if (visivel === 7) {
            return <AprovarCaso userData={props.userData} texto={"Aprovar Casos"}/>
        }else if (visivel === 8) {
            return <ConfigUsuario configProjeto={configProjeto} userData={props.userData} texto={"Configuraçao Projeto"}/>
        }else if (visivel === 9) {
            return <EstatisticaCaso userData={props.userData} texto={"Estatistica Caso"}/>
        }else if(visivel === 10){
            return <Commits userData={props.userData} texto={"Commits"} configProjeto={configProjeto}/>
        }else if(visivel === 11){
            return <CasosAprovados userData={props.userData} texto={"Casos Aprovados"} configProjeto={configProjeto}/>
        }else if(visivel === 12){
            return <ListarUsuario userData={props.userData} texto={"Chat"} configProjeto={configProjeto}/>
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
    

                    {configProjeto.nome_projeto && configProjeto.nome_projeto !== '' ? (
        <a
          href={configProjeto.repositorio || undefined} // Use '#' como link padrão se o repositório estiver vazio
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }} // Remova a decoração de link
        >
          <Typography variant="h6" noWrap component="div" style={{ color: 'white', textTransform: 'uppercase' }}>
            {configProjeto.nome_projeto}
          </Typography>
        </a>
      ) : (
        <Typography variant="h6" noWrap component="div" style={{ textTransform: 'uppercase', color: 'white' }}>
          Gerenciador de Projetos
        </Typography>
      )}


                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Typography variant="h6" noWrap component="div">

                        {/**AJUSTE AQUI */}
                        <CustomMenu userData={props.userData} seletorDeComponente={setVisivel} handleLogout={handleLogout}></CustomMenu>

                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {/*adiciona itens*/}
                    <ListItem onClick={() => { setVisivel(1) }} key={1} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Meus Casos"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem onClick={() => { setVisivel(2) }} key={2} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Adicionar Caso"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    {/*LISTAR CASOS*/}
                    <ListItem onClick={() => { setVisivel(3) }} key={3} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Listar Casos"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

{/*APROVAR CASOS*/}
                    <ListItem
      onClick={() => { setVisivel(7) }}
      key={7}
      disablePadding
      sx={{
        display: userData.tipo_usuario !== 'dev' ? 'block' : 'none',
      }}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          <ThumbUpIcon/>
        </ListItemIcon>
        <ListItemText primary={"Aprovar Casos"} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>

        <ListItem
      onClick={() => { setVisivel(4) }}
      key={4}
      disablePadding
      sx={{
        display: userData.tipo_usuario === 'adm' ? 'block' : 'none',
      }}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          <SupervisorAccount/>
        </ListItemIcon>
        <ListItemText primary={"Administrar Usuários"} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>


                    {/*CONFIGS DO PROJETO*/}
                    <ListItem onClick={() => { setVisivel(5) }} key={5} disablePadding sx={{  display: userData.tipo_usuario === 'adm' ? 'block' : 'none' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Configs do Projeto"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    {/*CASOS APROVADOS*/}
                    <ListItem onClick={() => { setVisivel(11)}} key={0} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <CheckCircle />
                            </ListItemIcon>
                            <ListItemText primary={"Casos Aprovados"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    {/* ESTATISTICAS DE CASO */}
                    <ListItem onClick={() => { setVisivel(9)}} key={0} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <BarChart/>
                            </ListItemIcon>
                            <ListItemText primary={"Estatisticas Casos"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    {/* COMMITS */}
                    {configProjeto.repositorio && (
  <ListItem onClick={() => { setVisivel(10)}} key={0} disablePadding sx={{ display: 'block' }}>
    <ListItemButton
      sx={{
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 3 : 'auto',
          justifyContent: 'center',
        }}
      >
        <GitHubIcon />
      </ListItemIcon>
      <ListItemText primary={"Commits"} sx={{ opacity: open ? 1 : 0 }} />
    </ListItemButton>
  </ListItem>
)}

        {/**CHAT*/}

        <ListItem onClick={() => { setVisivel(12)}} key={0} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
            sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            }}
        >
        <ListItemIcon
            sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
            }}
        >         
             <ChatIcon  />
      </ListItemIcon>
      <ListItemText primary={"Chat"} sx={{ opacity: open ? 1 : 0 }} />
    </ListItemButton>
    </ListItem>


                </List>
                <Divider />
                <List>
                    {/*CONFIGS USUARIOS*/}
                <ListItem onClick={() => { setVisivel(8)}} key={0} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Configs Usuário"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem onClick={handleLogout} key={0} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Deslogar"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {/*LEMBRAR QUE AQUI E A MAIN DOS CONTEUDOS*/}
                <Container>
                    {seletorDeComponente()}
                </Container>
            </Box>
        </Box>
    );
}