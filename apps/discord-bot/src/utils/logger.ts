import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'discord-bot.log' })
  ]
});

export function logCommand(command: string, userId: string, ...args: any[]) {
  logger.info(`Command: ${command} | User: ${userId}`, { args });
}

export function logError(error: Error, context: string) {
  logger.error(`Error in ${context}:`, error);
}

export default logger;