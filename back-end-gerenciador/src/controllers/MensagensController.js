const Usuario = require("../models/Usuario");
const Casos = require("../models/Caso");
const ProjetoConfig = require("../models/ProjetoConfig");
const Sequelize = require("sequelize");
const multer = require('multer');
const path = require('path');
const Mensagens = require("../models/Mensagens");
const { Op } = require('sequelize');

exports.enviarMensagem = async (req,res) => {
    try {
        const { remetente, texto, userId, remetenteLocal, paraUsuario, de } = req.body;
    
        const mensagem = await Mensagens.create({
          remetente,
          texto,
          userId,
          remetenteLocal,
          paraUsuario,
          de,
        });
    
        res.status(201).json(mensagem);
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
}

exports.obterMensagensPorUsuario = async(req,res) =>{
    try {
        const { userId } = req.body;
    
        const mensagens = await Mensagens.findAll({
          where: {
            [Op.or]: [{ paraUsuario: userId }, { de: userId }],
          },
        });
    
        res.status(200).json(mensagens);
      } catch (error) {
        console.error('Erro ao obter mensagens:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
}