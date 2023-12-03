const Usuario = require("../models/Usuario");
const Casos = require("../models/Caso");
const LinhaTempo = require("../models/LinhaTempo");
const Sequelize = require("sequelize");
const CasoConcluido = require("../models/CasoConcluido");

exports.listarTodaLinhaDoTempo = async (req, res) => {
  try {
      const linhaDoTempo = await LinhaTempo.findAll({
        order: [['id', 'ASC']],
      });
      res.status(200).json(linhaDoTempo);
  } catch (error) {
      console.error('Erro ao listar toda linha do tempo:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.listarPorRelator = async (req, res) => {
    const { relator } = req.body;
    
    try {
        //LEMBRE QUE NO SEQUELIZE O 'EQ' E PRA DE INGUAL
      const linhaDoTempo = await LinhaTempo.findAll({
        order: [['id', 'ASC']],
        where: {
          relator: {
            [Sequelize.Op.eq]: relator, 
          },
        },
      });  
      res.status(200).json(linhaDoTempo);
    } catch (error) {
      console.error('Erro ao listar linha do tempo por relator:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };


  exports.adicionarEvento = async (req,res) => {
    const { descricao,relator } = req.body;
    try {
        const novoEvento = await LinhaTempo.create({
            descricao,
            relator,
        });
        res.status(200).json(novoEvento);
    } catch (error) {
        console.error('Erro ao adicionar evento à linha do tempo:', error);
        throw error;
    }
}; 