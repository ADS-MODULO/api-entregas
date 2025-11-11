require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
// const pedidoRoutes = require('./routes/pedidoRoutes');
// const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Rotas
app.use('/api/auth', authRoutes);
// app.use('/api/pedidos', pedidoRoutes);
// app.use('/api/usuarios', usuarioRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Sistema de Entregas - Ativa ✅',
    version: '1.0.0',
    database: 'MariaDB',
    endpoints: {
      auth: '/api/auth',
      pedidos: '/api/pedidos',
      usuarios: '/api/usuarios',
    }
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    erro: 'Erro interno do servidor',
    mensagem: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Banco de dados: MariaDB`);
});

