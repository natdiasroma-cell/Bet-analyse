const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'bet_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bet_analyse'
});

pool.on('error', (error) => {
  logger.error('Unexpected error on idle client', error);
});

module.exports = pool;
