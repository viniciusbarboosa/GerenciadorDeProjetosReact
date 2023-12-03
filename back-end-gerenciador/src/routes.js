const express = require('express');
const route = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

//CONTROLLERS
const loginController = require('./controllers/LoginController');
const casosController = require('./controllers/CasosController');
const usuariosController = require('./controllers/UsersController');
const projetoConfigController = require('./controllers/ProjetoConfigController');
const linhaTempoController = require('./controllers/LinhaTempoController');
const mensagensController = require('./controllers/MensagensController');


//ROTAS
//LOGIN
route.post("/login",loginController.login);
route.post("/cadastrar",loginController.cadastrarUsuario);

//USUARIOS
route.post("/listarUsuarios",casosController.listarUsuarios);
route.post("/desativarUsuario",casosController.desativarUsuario);
route.post("/ativarUsuario",casosController.ativarUsuario);
route.post("/atualizarUsuario",usuariosController.editarUsuario);
route.post("/pesquisarUsuario",usuariosController.listarUsuariosPorNome);
route.post("/listarUsuarioForaMeuUser",usuariosController.listarUsuariosExcluindoProprioUsuario);



//CASOS
route.post("/cadastrarCaso", upload.single('arquivo'), casosController.cadastrarCaso);
route.get("/listarCasos",casosController.listarTodosCaso);
route.get("/pesquisarCasos",casosController.pesquisarCasos);
route.post("/atribuirCasoMeuUser",casosController.atribuirCasoMeuUser);
route.post("/concluirCaso",casosController.concluirCasoMeuUser);
route.post("/atualizarCommit",casosController.atualizarCommitCaso);
route.post("/meusCasos",casosController.listarCasosDoUsuarioTrabalhando);
route.post("/CasosConcluidos",casosController.listarCasosConcluidos);
route.post("/AprovarCaso",casosController.AprovarCaso);
route.post("/VoltarCaso",casosController.VoltarCaso);
route.post("/estatisticasCasos",casosController.obterEstatisticasCasos);
route.post("/casosAprovados",casosController.listaCasosAprovados);
route.post('/downloadArquivo', casosController.downloadArquivo);

//CONFIGURAÇÕES
route.post("/listarProjetoConfig",projetoConfigController.pegarConfigs);
route.post("/atualizarConfig",projetoConfigController.atualizarConfig);

//LINHA DO TEMPOP
route.post("/pegarLinhaTempo",linhaTempoController.listarTodaLinhaDoTempo);
route.post("/pegarLinhaTempoRelator",linhaTempoController.listarPorRelator);
route.post("/adicionarLinhaTempo",linhaTempoController.adicionarEvento);

//MENSAGENS
route.post('/enviar', mensagensController.enviarMensagem);
route.post('/obterPorUsuario', mensagensController.obterMensagensPorUsuario);

module.exports = route;