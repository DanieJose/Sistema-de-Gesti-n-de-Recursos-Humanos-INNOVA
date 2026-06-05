const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME ?? 'sistema_rrhh',
  process.env.DB_USER ?? 'root',
  process.env.DB_PASS ?? 'FRamIHqKpMRLCxadepuyXmfiKQuxjrXr',
  {
    host: process.env.DB_HOST ?? '@autorack.proxy.rlwy.net',
    port: process.env.DB_PORT ?? 48674,
    dialect: 'mysql',
    logging: false, // Set to true to see SQL queries
  }
);

module.exports = sequelize;
//mysql://root:FRamIHqKpMRLCxadepuyXmfiKQuxjrXr@autorack.proxy.rlwy.net:48674/railway   sistema_rrhh
//mysql://root:DUhBTZhVFzcXkbMFBgQhQiHuZGmBjuys@kodama.proxy.rlwy.net:25674/railway