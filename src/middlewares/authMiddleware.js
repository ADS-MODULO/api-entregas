const { verificarToken } = require('../utils/jwtHelper');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ erro: 'Formato de token inválido' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: 'Token mal formatado' });
  }

  const decoded = verificarToken(token);

  if (!decoded) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }

  req.usuario = decoded;
  next();
};

// Middleware para verificar tipo de usuário
const verificarTipo = (...tiposPermitidos) => {
  return (req, res, next) => {
    if (!tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ 
        erro: 'Acesso negado',
        mensagem: 'Você não tem permissão para acessar este recurso'
      });
    }
    next();
  };
};

module.exports = { authMiddleware, verificarTipo };

