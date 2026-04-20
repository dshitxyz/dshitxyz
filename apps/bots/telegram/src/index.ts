import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import * as dotenv from 'dotenv';

// Import commands
import { priceCommand } from './commands/price';
import { statsCommand } from './commands/stats';
import { leaderboardCommand } from './commands/leaderboard';
import { memeCommand, shopCommand, dashboardCommand, galleryCommand } from './commands/links';
import { setAlertCommand, alertsCommand, removeAlertCommand } from './commands/alerts';

// Import utilities
import { logBotStatus, logCommandExecution } from './utils/errorHandler';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN not set in environment');
}

const bot = new Telegraf(BOT_TOKEN);

/**
 * Start command - Welcome message
 */
bot.start((ctx) => {
  try {
    logCommandExecution('start', ctx.from?.id);

    ctx.reply(
      `👋 Welcome to dshit.xyz Telegram Bot!

I can help you with:
• 📊 /price - Get DSHIT token price
• 📈 /stats - Platform statistics
• 🏆 /leaderboard - Top creators
• 🎨 /meme - Create a meme (link to web app)
• 📦 /shop - Browse products
• 🔔 /set_alert - Set price alerts
• 📋 /alerts - View your alerts
• 🎨 /gallery - View community memes
• 📊 /dashboard - Your dashboard

Type /help for more commands.`
    );
  } catch (error) {
    ctx.reply('❌ Error. Please try again.');
  }
});

/**
 * Help command - Command reference
 */
bot.help((ctx) => {
  try {
    logCommandExecution('help', ctx.from?.id);

    ctx.replyWithMarkdown(
      `🚀 **dshit.xyz Bot Commands**

**📊 Information:**
/price - Current DSHIT token price
/stats - Platform statistics (memes, creators, votes)
/leaderboard - Top 5 creators by votes

**🎯 Actions:**
/meme - Get link to meme creator
/shop - Get link to product shop
/dashboard - Get link to your dashboard
/gallery - Browse community memes

**🔔 Price Alerts:**
/set_alert <price> - Set price alert (e.g., /set_alert 0.50)
/alerts - View your current alerts
/remove_alert <id> - Remove an alert

**🆘 Support:**
/help - Show this help message
/feedback - Send feedback

Use /start to return to main menu.`
    );
  } catch (error) {
    ctx.reply('❌ Error displaying help. Please try again.');
  }
});

// Register command handlers
bot.command('price', priceCommand);
bot.command('stats', statsCommand);
bot.command('leaderboard', leaderboardCommand);
bot.command('meme', memeCommand);
bot.command('shop', shopCommand);
bot.command('dashboard', dashboardCommand);
bot.command('gallery', galleryCommand);
bot.command('set_alert', setAlertCommand);
bot.command('alerts', alertsCommand);
bot.command('remove_alert', removeAlertCommand);

/**
 * Feedback command
 */
bot.command('feedback', (ctx) => {
  try {
    logCommandExecution('feedback', ctx.from?.id);

    ctx.reply(
      'Thanks for your interest! Feedback functionality coming soon. ' +
        'For now, please reach out on Discord or Twitter.'
    );
  } catch (error) {
    ctx.reply('❌ Error. Please try again.');
  }
});

/**
 * Text message handler
 */
bot.on(message('text'), (ctx) => {
  try {
    const text = ctx.message.text.toLowerCase();

    // Suggest relevant commands based on message content
    if (text.includes('price')) {
      ctx.reply('Use /price to get the current token price');
      return;
    }

    if (text.includes('alert')) {
      ctx.reply('Use /set_alert <price> to create a price alert');
      return;
    }

    if (text.includes('meme')) {
      ctx.reply('Use /meme to open the meme creator');
      return;
    }

    // Default response
    ctx.reply(
      "I didn't understand that. Use /help to see available commands or /start to return to the main menu."
    );
  } catch (error) {
    ctx.reply('❌ Error processing your message. Please try again.');
  }
});

/**
 * Error handling
 */
bot.catch((err) => {
  console.error('[ERROR] Bot error:', err);
});

/**
 * Start the bot
 */
const startBot = async () => {
  try {
    await bot.launch();
    logBotStatus('started', `API Base URL: ${API_BASE_URL}`);

    // Handle graceful shutdown
    process.once('SIGINT', () => {
      logBotStatus('stopped', 'SIGINT');
      bot.stop('SIGINT');
    });
    process.once('SIGTERM', () => {
      logBotStatus('stopped', 'SIGTERM');
      bot.stop('SIGTERM');
    });
  } catch (error) {
    console.error('[FATAL] Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();
