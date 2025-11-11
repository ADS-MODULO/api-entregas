const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { gerarToken } = require('../utils/jwtHelper');

// Registro
exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone } = req.body;

    // Validações básicas
    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ 
        erro: 'Campos obrigatórios faltando',
        campos: ['nome', 'email', 'senha', 'tipo']
      });
    }

    // Verificar se email já existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      tipo,
      telefone,
    });

    // Gerar token
    const token = gerarToken({ 
      id: usuario.id, 
      tipo: usuario.tipo,
      email: usuario.email 
    });

    res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        telefone: usuario.telefone,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ 
      erro: 'Erro ao registrar usuário', 
      detalhes: error.message 
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações
    if (!email || !senha) {
      return res.status(400).json({ 
        erro: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar usuário
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Verificar se está ativo
    if (!usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário inativo' });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = gerarToken({ 
      id: usuario.id, 
      tipo: usuario.tipo,
      email: usuario.email 
    });

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        telefone: usuario.telefone,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ 
      erro: 'Erro ao fazer login', 
      detalhes: error.message 
    });
  }
};

// Obter perfil do usuário logado
exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ usuario });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ 
      erro: 'Erro ao buscar perfil', 
      detalhes: error.message 
    });
  }
};

