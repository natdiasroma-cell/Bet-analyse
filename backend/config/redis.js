const redis = require('redis');
const logger = require('../utils/logger');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (error) => {
  logger.error('Redis client error', error);
});

client.connect().then(() => {
  logger.info('Redis client connected');
}).catch((error) => {
  logger.error('Failed to connect Redis:', error);
});

module.exports = client;
