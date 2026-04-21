import 'dotenv/config';
import { Telegraf } from 'telegraf';
import logger from './utils/logger';
import { BotConfig } from './types';
import { priceHandler } from './handlers/price';
import { memsHandler } from './handlers/memes';
import { orderHandler } from './handlers/orders';
import { governanceHandler } from './handlers/governance';
import { adminHandler } from './handlers/admin';

/**
 * Validate bot configuration
 */
function validateConfig(): BotConfig {
  const requiredEnvVars = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_ADMIN_ID', 'DSHIT_API_URL'];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    token: process.env.TELEGRAM_BOT_TOKEN!,
    adminId: parseInt(process.env.TELEGRAM_ADMIN_ID!, 10),
    apiUrl: process.env.DSHIT_API_URL!,
    priceApiUrl: process.env.DSHIT_PRICE_API || 'https://api.example.com/price',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost/dshit',
    logLevel: process.env.LOG_LEVEL || 'info',
    environment: (process.env.NODE_ENV as any) || 'development',
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL,
    webhookPort: process.env.TELEGRAM_WEBHOOK_PORT ? parseInt(process.env.TELEGRAM_WEBHOOK_PORT, 10) : undefined,
  };
}

/**
 * Initialize Telegram Bot
 */
async function startBot(): Promise<void> {
  try {
    const config = validateConfig();
    logger.info('Initializing Telegram Bot', { environment: config.environment });

    const bot = new Telegraf(config.token);

    // Error handling
    bot.catch((err, ctx) => {
      logger.error('Bot error occurred', {
        error: err.message,
        userId: ctx?.from?.id,
        chatId: ctx?.chat?.id,
      });
      ctx?.reply('❌ An error occurred. Please try again later.');
    });

    // Start command
    bot.start(async (ctx) => {
      logger.info('User started bot', { userId: ctx.from.id });
      await ctx.reply(
        '🚀 Welcome to dshit.xyz Bot!\n\n' +
          '📍 Available Commands:\n' +
          '/price - Get current DSHIT price\n' +
          '/submit - Submit a meme\n' +
          '/orders - Check your orders\n' +
          '/proposals - View DAO proposals\n' +
          '/help - Show all commands\n' +
          '/subscribe - Enable notifications\n' +
          '/unsubscribe - Disable notifications'
      );
    });

    // Help command
    bot.help(async (ctx) => {
      await ctx.reply(
        '📚 *Available Commands*\n\n' +
          '/price - 💰 Get DSHIT price & market data\n' +
          '/subscribe - 🔔 Enable notifications\n' +
          '/unsubscribe - 🔕 Disable notifications\n' +
          '/submit - 🎨 Submit a meme\n' +
          '/orders - 📦 Check order status\n' +
          '/proposals - 🗳️ View governance proposals\n' +
          '/vote - 🗳️ Cast a vote\n' +
          '/help - 📚 Show this help message',
        { parse_mode: 'Markdown' }
      );
    });

    // Register command handlers
    priceHandler(bot);
    memsHandler(bot);
    orderHandler(bot);
    governanceHandler(bot);
    adminHandler(bot, config.adminId);

    // Graceful shutdown
    process.once('SIGINT', () => {
      logger.info('Graceful shutdown initiated');
      bot.stop('SIGINT');
      process.exit(0);
    });

    process.once('SIGTERM', () => {
      logger.info('Graceful shutdown initiated');
      bot.stop('SIGTERM');
      process.exit(0);
    });

    // Start polling or webhook
    if (config.webhookUrl && config.webhookPort) {
      logger.info('Starting bot with webhook', {
        url: config.webhookUrl,
        port: config.webhookPort,
      });
      await bot.launch({
        webhook: {
          domain: config.webhookUrl,
          port: config.webhookPort,
        },
      });
    } else {
      logger.info('Starting bot with polling');
      await bot.launch();
    }

    logger.info('Telegram Bot started successfully');
  } catch (error) {
    logger.error('Failed to start bot', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// Start the bot
startBot().catch((error) => {
  logger.error('Unexpected error', { error: error instanceof Error ? error.message : String(error) });
  process.exit(1);
});
