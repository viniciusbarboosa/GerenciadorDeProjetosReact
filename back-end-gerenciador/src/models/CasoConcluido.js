const Sequelize = require("sequelize");
const connection = require("../../database/database");

const CasoConcluido = connection.define('caso_concluido', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
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

CasoConcluido.sync({ force: false })
    .then(() => {
        console.log("Tabela 'casos concluidos' criada ou já existe.");
    })
    .catch(error => {
        console.error("Erro ao criar a tabela de caso conluido:", error);
    });

module.exports = CasoConcluido;