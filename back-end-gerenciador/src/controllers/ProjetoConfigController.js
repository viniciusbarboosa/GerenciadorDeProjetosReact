const Usuario = require("../models/Usuario");
const Casos = require("../models/Caso");
const ProjetoConfig = require("../models/ProjetoConfig");
const Sequelize = require("sequelize");
const multer = require('multer');
const path = require('path');

exports.atualizarConfig = async (req,res)=> {
    try {
        const { nome_projeto, repositorio } = req.body;
        
        const nomeProjetoPreenchido = nome_projeto || '';
        const repositorioPreenchido = repositorio || '';
      
        const projetoConfig = await ProjetoConfig.findOne();
      
        if (projetoConfig) {
          projetoConfig.nome_projeto = nomeProjetoPreenchido;
          projetoConfig.repositorio = repositorioPreenchido;
      
          await projetoConfig.save();
        } else {
          await ProjetoConfig.create({
            nome_projeto: nomeProjetoPreenchido,
            repositorio: repositorioPreenchido
          });
        }
      
        res.status(200).json({ message: 'Configurações do projeto salvas com sucesso.' });
      } catch (error) {
        console.error('Erro ao salvar configurações do projeto:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
      }
}  

exports.pegarConfigs = async (req, res) => {
    try {
        const projetoConfig = await ProjetoConfig.findOne();

        if (projetoConfig.length === 0) {
            res.status(200).json([]);
        } else {
            res.status(200).json(projetoConfig);
        }
    } catch (error) {
        console.error('Erro ao listar configs:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}
