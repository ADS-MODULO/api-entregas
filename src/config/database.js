const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mariadb',
    dialectOptions: {
      connectImeout: 10000,
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
 	charset: 'utf8mb4',
	collate: 'utf8mb4_unicode_ci',
	timestamps: true,
    },
  }
);

// Testar conexão
const testarConexao = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com MariaDB estabelecida com sucesso!');
    console.log(`📊 Banco: ${process.env.DB_NAME}`);
    console.log(`🌐 Host: ${process.env.DB_HOST}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao MariaDB:', error.message);
    console.error('Verifique suas credenciais no arquivo .env');
    process.exit(1);
  }
};

testarConexao();

module.exports = sequelize;

