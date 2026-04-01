import { Telegraf } from 'telegraf';
import { handlePriceCommand, handlePriceAlert } from './handlers/price.js';
import { handleMemeCommand, handleContestStatus } from './handlers/memes.js';
import { handleGovernanceCommand, handleVotingStatus } from './handlers/governance.js';
import logger from './lib/logger.js';

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_TOKEN environment variable is required');
}

const bot = new Telegraf(token);

// Middleware for logging
bot.use((ctx, next) => {
  logger.info('Incoming message', {
    userId: ctx.from?.id,
    text: ctx.message?.text?.substring(0, 50)
  });
  return next();
});

// Commands
bot.command('start', (ctx) => {
  const message = `
👋 **Welcome to DSHIT Bot!**

I can help you with:
• 💰 /price - Get current $DSHIT price
• 🔔 /alerts - Set up price alerts
• 🎨 /meme - Submit a meme
• 🏆 /contest - View weekly contest
• 🏛️ /gov - Check governance status
• 🗳️ /voting - Check your voting power

Use /help for more commands.
  `.trim();
  
  ctx.reply(message, { parse_mode: 'Markdown' });
});

bot.command('help', (ctx) => {
  const message = `
📖 **DSHIT Bot Commands**

💰 Price & Trading:
  /price - Current $DSHIT price
  /alerts - Enable/disable price alerts
  /trade - Buy $DSHIT on Uniswap

🎨 Memes & Community:
  /meme - Submit a meme
  /contest - View weekly contest
  /leaderboard - Top meme creators

🏛️ Governance:
  /gov - Governance status
  /voting - Your voting power
  /proposals - Active proposals

❓ Help:
  /help - Show this message
  /start - Welcome message
  `.trim();
  
  ctx.reply(message, { parse_mode: 'Markdown' });
});

bot.command('price', handlePriceCommand);
bot.command('alerts', handlePriceAlert);
bot.command('meme', handleMemeCommand);
bot.command('contest', handleContestStatus);
bot.command('gov', handleGovernanceCommand);
bot.command('voting', (ctx) => {
  const walletAddress = ctx.message.text?.split(' ')[1];
  handleVotingStatus(ctx, walletAddress);
});

// Default handler for unknown commands
bot.on('text', (ctx) => {
  if (!ctx.message.text?.startsWith('/')) {
    ctx.reply(
      '❓ Unknown command. Use /help for available commands.',
      { reply_to_message_id: ctx.message.message_id }
    );
  }
});

// Error handling
bot.catch((err, ctx) => {
  logger.error('Bot error', {
    error: err instanceof Error ? err.message : 'Unknown error',
    userId: ctx.from?.id
  });
  ctx.reply('❌ An error occurred. Please try again later.');
});

// Launch bot
bot.launch()
  .then(() => {
    logger.info('Telegram bot launched successfully');
  })
  .catch((error) => {
    logger.error('Failed to launch Telegram bot', { error });
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;
