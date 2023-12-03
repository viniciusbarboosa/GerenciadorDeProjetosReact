const Sequelize = require("sequelize");
const connection = require("../../database/database");

const ProjetoConfig = connection.define('projeto_config', {
    nome_projeto: {
        type: Sequelize.STRING,
        allowNull: true
    },
    repositorio: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    imagem: {
        type: Sequelize.STRING,
        allowNull: true 
    },
});


ProjetoConfig.sync({ force: false })
  .then(async () => {

    console.log("Tabela 'ProjetoConfig' Criada ou Já Existe");

    const count = await ProjetoConfig.count();
    if (count === 0) {
      await ProjetoConfig.create({
        nome_projeto: null,
        repositorio: null,
        imagem: null,
      });
      console.log("ProjetoConfigpadrão criado.");
    }
  })
  .catch(error => {
    console.error("Erro ao criar a tabela de ProjetoConfig:", error);
  });


module.exports = ProjetoConfig;