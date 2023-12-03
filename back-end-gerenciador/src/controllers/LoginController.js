const Usuario = require("../models/Usuario");

exports.cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, tipo_usuario } = req.body;
  
    try {
      const existingEmail = await Usuario.findOne({
        where: { email },
      });
  
      const existingNome = await Usuario.findOne({
        where: { nome },
      });
  
      if (existingEmail) {
        return res.status(400).json({ error: 'Este email já está em uso.' });
      }
  
      if (existingNome) {
        return res.status(400).json({ error: 'Este nome já está em uso.' });
      }

      const newUser = await Usuario.create({
        nome,
        email,
        senha,
        tipo_usuario,
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

exports.login = async (req,res)=>{
    const {nome,senha} = req.body;
    try {
        const user = await Usuario.findOne({
          where: {
            nome: nome,
            senha: senha,
          },
        });
    
        if (user) {
          if(!user.ativo){
            return res.status(402).json(user);
          }
          return res.status(200).json(user);
        } else {
          return res.status(401).json({message: "Credencias Invalidas"});
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send("Erro interno do servidor.");
      }
}