const Sequelize = require('sequelize');
const connection = new Sequelize('gerenciador_projetos','root','',{
    host:'localhost',
    dialect:'mysql'
});

module.exports = connection;