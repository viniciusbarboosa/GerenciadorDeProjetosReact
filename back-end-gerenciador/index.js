const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./database/database');
const path = require('path');

// ARQUIVO DE ROTAS
const routes = require('./src/routes');

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: 'http://localhost:3000', // Substitua pelo endereço do seu aplicativo React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Conexao com Banco
connection
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

app.use(routes);

// Criando uma instância do Socket.IO associada ao servidor HTTP
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000', // Substitua pelo endereço do seu aplicativo React
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
});

// Lógica do Socket.IO
io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('enviarMensagem', (mensagem) => {
    io.emit('novaMensagem', mensagem);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3333;
const SOCKET_PORT = process.env.SOCKET_PORT || 3334;

server.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});

io.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO está ouvindo na porta ${SOCKET_PORT}`);
});
