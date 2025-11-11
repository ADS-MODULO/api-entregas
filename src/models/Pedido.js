const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  entregador_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  endereco_origem: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  endereco_destino: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aceito', 'em_rota', 'entregue', 'cancelado'),
    defaultValue: 'pendente',
  },
}, {
  tableName: 'pedidos',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

module.exports = Pedido;

