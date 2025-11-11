const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Pedido = require('./Pedido');

// Relacionamentos
Pedido.belongsTo(Usuario, { 
  as: 'cliente', 
  foreignKey: 'cliente_id',
  onDelete: 'CASCADE',
});

Pedido.belongsTo(Usuario, { 
  as: 'entregador', 
  foreignKey: 'entregador_id',
  onDelete: 'SET NULL',
});

Usuario.hasMany(Pedido, { 
  as: 'pedidos_como_cliente', 
  foreignKey: 'cliente_id' 
});

Usuario.hasMany(Pedido, { 
  as: 'pedidos_como_entregador', 
  foreignKey: 'entregador_id' 
});

// Sincronizar banco (criar tabelas)
const sincronizarBanco = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } para recriar
    console.log('✅ Tabelas sincronizadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar tabelas:', error.message);
  }
};

// Se executar diretamente este arquivo
if (require.main === module) {
  sincronizarBanco().then(() => process.exit(0));
}

module.exports = { Usuario, Pedido, sequelize };

