const Sequelize = require("sequelize");
const connection = require("../../database/database");

const Caso = connection.define('caso', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT('long'),
        allowNull: false
    },
    prioridade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_relator: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    nome_relator: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_usuario_trabalhando: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    usuario_trabalhando: {
        type: Sequelize.STRING,
        allowNull: true
    },
    commit: {
        type: Sequelize.STRING,
        allowNull: true
    },
    arquivo: {
      type: Sequelize.STRING,
      allowNull: true
    },
});

Caso.sync({ force: false })
    .then(() => {
        console.log("Tabela 'casos' criada ou já existe.");
    })
    .catch(error => {
        console.error("Erro ao criar a tabela de casos:", error);
    });

module.exports = Caso;