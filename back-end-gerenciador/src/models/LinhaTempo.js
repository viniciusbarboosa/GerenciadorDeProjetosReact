const Sequelize = require("sequelize");
const connection = require("../../database/database");

const LinhaTempo = connection.define('linha_do_tempo', {
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    relator: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

LinhaTempo.sync({ force: false })
    .then(() => {
        console.log("Tabela 'linha_do_tempo'' criada ou já existe.");
    })
    .catch(error => {
        console.error("Erro ao criar a tabela de linha_do_tempo':", error);
    });

module.exports = LinhaTempo;