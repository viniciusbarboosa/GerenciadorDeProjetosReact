const Sequelize = require("sequelize");
const connection = require("../../database/database");
const { usuarioPadrao } = require("../../configAdmin");

const Mensagens = connection.define('Mensagen',{
    remetente: {
        type: Sequelize.STRING,
        allowNull: false
    },
    texto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    remetenteLocal: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    paraUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    de: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    dataEnvio: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW 
    }
});

Mensagens.sync({ force: false })
    .then(() => {
        console.log("Tabela 'Mensagens'' criada ou já existe.");
    })
    .catch(error => {
        console.error("Erro ao criar a tabela de Mensagens':", error);
    });

module.exports = Mensagens;