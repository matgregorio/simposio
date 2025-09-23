import pino from 'pino';

const logger = pino({
  name: 'simposio-api',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

export default logger;
