const Usuario = require("../models/Usuario");
const Casos = require("../models/Caso");
const LinhaTempo = require("../models/LinhaTempo");
const Sequelize = require("sequelize");
const CasoConcluido = require("../models/CasoConcluido");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.cadastrarCaso = async (req, res) => {
  try {
    const { nome, descricao, prioridade, id_relator, nome_relator, status } = req.body;

    let arquivo = null;

    if (req.file) {
      arquivo = req.file.filename;
    }

    const novoCaso = await Casos.create({
      nome,
      descricao,
      prioridade,
      id_relator,
      nome_relator,
      status,
      arquivo,
    });

    res.status(201).json(novoCaso);
  } catch (error) {
    console.error('Erro ao cadastrar o caso:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.listarTodosCaso = async (req, res) => {
        try {
          const casos = await Casos.findAll();
          res.status(200).json(casos);
        } catch (error) {
          console.error('Erro ao listar casos:', error);
          res.status(500).json({ error: 'Erro interno do servidor.' });
        }
}; 

exports.pesquisarCasos = async (req, res) => {
    try {
        const { searchText } = req.query;
    
        const casos = await Casos.findAll({
          where: {
            nome: {
              [Sequelize.Op.like]: `%${searchText}%`,
            },
          },
        });
    
        res.status(200).json(casos);
      } catch (error) {
        console.error('Erro ao pesquisar casos:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
      }
}

exports.atribuirCasoMeuUser = async (req, res) => {
    try {
      const { userId, casoId, nomeUsuario } = req.body; 
      
      const caso = await Casos.findByPk(casoId);
  
      if (!caso) {
        return res.status(404).json({ error: 'Caso não encontrado.' });
      }
  
      caso.id_usuario_trabalhando = userId;
      caso.status = 'em desenvolvimento';
      caso.usuario_trabalhando = nomeUsuario;

      await caso.save();
  
      return res.status(200).json({ message: 'Caso atribuído com sucesso.' });
    } catch (error) {
      console.error('Erro ao atribuir caso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

  exports.atualizarCommitCaso = async (req, res) => {
    try {
      const { casoId, novoCommit } = req.body;
  
      const caso = await Casos.findByPk(casoId);
  
      if (!caso) {
        return res.status(404).json({ error: 'Caso não encontrado.' });
      }
  
      caso.commit = novoCommit;
  
      await caso.save();
  
      return res.status(200).json({ message: 'Commit do caso atualizado com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar commit do caso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

  exports.concluirCasoMeuUser = async (req, res) => {
    try {
      const { userId, casoId, nomeUsuario } = req.body; 
      
      const caso = await Casos.findByPk(casoId);
  
      if (!caso) {
        return res.status(404).json({ error: 'Caso não encontrado.' });
      }
  
      caso.id_usuario_trabalhando = userId;
      caso.status = 'concluido';
      caso.usuario_trabalhando = nomeUsuario;

      await caso.save();
  
      return res.status(200).json({ message: 'Caso concluido com sucesso.' });
    } catch (error) {
      console.error('Erro ao atribuir caso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };  

  exports.listarCasosDoUsuarioTrabalhando = async (req, res) => {
    try {
      const idUsuarioTrabalhando = req.body.id_usuario_trabalhando; // Supondo que você passe o ID como um parâmetro na rota
      const casos = await Casos.findAll({
        where: {
          id_usuario_trabalhando: idUsuarioTrabalhando,
        },
      });
      res.status(200).json(casos);
    } catch (error) {
      console.error('Erro ao listar casos do usuário trabalhando:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

exports.listarUsuarios = async (req, res) => {
  try {
      const usuarios = await Usuario.findAll();
      res.status(200).json(usuarios);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};  

exports.desativarUsuario = async (req, res) => {
  const { id } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    await usuario.update({ ativo: false });

    res.status(200).json({ message: 'Usuário desativado com sucesso.' });
  } catch (error) {
    console.error('Erro ao desativar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.ativarUsuario = async (req, res) => {
  const { id } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    await usuario.update({ ativo: true });

    res.status(200).json({ message: 'Usuário ativado com sucesso.' });
  } catch (error) {
    console.error('Erro ao ativar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.listarCasosConcluidos = async (req, res) => {
  try {
    const casosConcluidos = await Casos.findAll({
      where: { status: 'concluido' } 
    });

    res.status(200).json(casosConcluidos);
  } catch (error) {
    console.error('Erro ao listar casos concluídos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.AprovarCaso = async (req, res) => {
  try {
    const { userId, casoId, nomeUsuario } = req.body; 

    const caso = await Casos.findByPk(casoId);

    if (!caso) {
      return res.status(404).json({ error: 'Caso não encontrado.' });
    }

    await CasoConcluido.create({
      nome: caso.nome,
      descricao: caso.descricao,
      prioridade: caso.prioridade,
      id_relator: caso.id_relator,
      nome_relator: caso.nome_relator,
      status: 'concluido', 
      commit: caso.commit,
      id_usuario_trabalhando: null, 
      usuario_trabalhando: caso.usuario_trabalhando, 
      arquivo:caso.arquivo
    });
    await caso.destroy();

    return res.status(200).json({ message: 'Caso atribuído com sucesso.' });
  } catch (error) {
    console.error('Erro ao atribuir caso:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.VoltarCaso = async (req, res) => {
  try {
    const { casoId } = req.body; 

    const caso = await Casos.findByPk(casoId);

    if (!caso) {
      return res.status(404).json({ error: 'Caso não encontrado.' });
    }

    caso.status = 'em desenvolvimento';

    await caso.save();

    return res.status(200).json({ message: 'Caso marcado como em desenvolvimento com sucesso.' });
  } catch (error) {
    console.error('Erro ao marcar caso como em desenvolvimento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.obterEstatisticasCasos = async (req, res) => {
  try {
    const casosEmDesenvolvimento = await Casos.count({
      where: { status: "em desenvolvimento" }
    });

    const casosAguardando = await Casos.count({
      where: { status: "aguardando" }
    });

    const casosConcluidos = await Casos.count({
      where: { status: "concluido" }
    });

    const casosAprovados = await CasoConcluido.count();

    const estatisticas = {
      emDesenvolvimento: casosEmDesenvolvimento,
      aguardando: casosAguardando,
      concluidos: casosConcluidos,
      casosAprovados: casosAprovados
    };

    res.status(200).json(estatisticas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.listaCasosAprovados = async (req,res)=>{
  try {
    const casosConcluidos = await CasoConcluido.findAll();
    res.status(200).json(casosConcluidos);
  } catch (error) {
    console.error('Erro ao listar casos Aprovados:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}


exports.downloadArquivo = async (req, res) => {
  try {
    const { casoId } = req.body;

    if (!casoId) {
      return res.status(400).json({ error: 'ID do caso não fornecido' });
    }

    const caso = await Casos.findByPk(casoId);

    if (!caso) {
      return res.status(404).json({ error: 'Caso não encontrado' });
    }

    if (!caso.arquivo) {
      return res.status(404).json({ error: 'Arquivo não encontrado para este caso' });
    }

    const filePath = path.join(__dirname, '..','..', 'public', 'uploads', caso.arquivo);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    res.download(filePath, caso.arquivo, (err) => {
      if (err) {
        console.error('Erro ao baixar o arquivo:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });
  } catch (error) {
    console.error('Erro ao processar a solicitação de download:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};