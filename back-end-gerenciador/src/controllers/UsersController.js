const Usuario = require("../models/Usuario");
const Casos = require("../models/Caso");
const Sequelize = require("sequelize");
const { Op } = require('sequelize');

exports.editarUsuario = async (req, res) => {
    const { id } = req.body;
    const { nome, email, senha, tipo_usuario, numero, gitHub } = req.body;
    const github = gitHub;

    try {
      const usuario = await Usuario.findByPk(id);
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  
      const existingEmail = await Usuario.findOne({
        where: { email, id: { [Op.not]: id } },
      });
  
      const existingNome = await Usuario.findOne({
        where: { nome, id: { [Op.not]: id } },
      });
  
      if (existingEmail) {
        return res.status(400).json({ error: 'Este email já está em uso.' });
      }
  
      if (existingNome) {
        return res.status(400).json({ error: 'Este nome já está em uso.' });
      }
  
      await usuario.update({
        nome,
        email,
        senha,
        tipo_usuario,
        numero,
        github
      });
  
      res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

exports.listarUsuariosPorNome = async (req, res) => {
    const { nome } = req.body; 
  
    try {
      const usuarios = await Usuario.findAll({
        where: {
          nome: {
            [Sequelize.Op.like]: `%${nome}%`, // Use o operador 'like' para procurar nomes parciais
          },
        },
      });
  
      if (usuarios.length === 0) {
        return res.status(404).json({ error: 'Nenhum usuário encontrado com o nome especificado.' });
      }
  
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários por nome:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };  

exports.listarUsuariosExcluindoProprioUsuario = async (req, res) => {
  const { idDoUsuarioLogado } = req.body;

  try {
    const usuarios = await Usuario.findAll({
      where: {
        id: {
          [Sequelize.Op.not]: idDoUsuarioLogado, 
        },
      },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários excluindo o próprio usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
