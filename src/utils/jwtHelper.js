const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'chave_super_secreta';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const gerarToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

const verificarToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { gerarToken, verificarToken };

