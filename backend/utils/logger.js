import { config } from '../config/index.js';

const isDev = config.nodeEnv === 'development';

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` | Data: ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaString}`;
};

export const logger = {
  info: (msg, meta) => {
    console.log(`\x1b[32m${formatMessage('INFO', msg, meta)}\x1b[0m`); // Green
  },
  warn: (msg, meta) => {
    console.warn(`\x1b[33m${formatMessage('WARN', msg, meta)}\x1b[0m`); // Yellow
  },
  error: (msg, errorStack) => {
    console.error(`\x1b[31m${formatMessage('ERROR', msg)}\x1b[0m`); // Red
    if (errorStack) console.error(`\x1b[31mStack: ${errorStack}\x1b[0m`);
  },
  debug: (msg, meta) => {
    if (isDev) {
      console.debug(`\x1b[34m${formatMessage('DEBUG', msg, meta)}\x1b[0m`); // Blue
    }
  }
};