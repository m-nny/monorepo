import pino from 'pino';

export const logger = pino({
  level: process.env.PINO_LEVEL || 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard',
    },
  },
});
