const Sequelize = require("sequelize");
const connection = require("../../database/database");
const { usuarioPadrao } = require("../../configAdmin");

const Usuario = connection.define('usuario',{
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo_usuario: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    numero: {
      type: Sequelize.STRING,
      allowNull: true
    },
    github: {
      type: Sequelize.STRING,
      allowNull: true
    }
});

Usuario.sync({ force: false })
  .then(async () => {

    console.log("Tabela 'usuarios' Criada ou Já Existe");

    const count = await Usuario.count();
    if (count === 0) {
      //Usuario apdrao
      await Usuario.create(usuarioPadrao);
      console.log("Usuário padrão criado.");
    }
  })
  .catch(error => {
    console.error("Erro ao criar a tabela de usuários:", error);
  });

module.exports = Usuario;