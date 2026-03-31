import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN not set in environment');
}

const bot = new Telegraf(BOT_TOKEN);

// Bot handlers
bot.start((ctx) => {
  ctx.reply(
    `👋 Welcome to dshit.xyz Telegram Bot!

I can help you with:
• 📊 /price - Get DSHIT token price
• 📈 /stats - Platform statistics
• 🏆 /leaderboard - Top creators
• 🎨 /meme - Create a meme (link to web app)
• 📦 /shop - Browse products
• 🔔 /alerts - Set price alerts (coming soon)

Type /help for more commands.`
  );
});

bot.help((ctx) => {
  ctx.reply(
    `🚀 **dshit.xyz Bot Commands**

**Information:**
/price - Current DSHIT token price
/stats - Platform statistics (memes, creators, votes)
/leaderboard - Top 5 creators by votes

**Actions:**
/meme - Get link to meme creator
/shop - Get link to product shop
/dashboard - Get link to user dashboard

**Alerts (Coming Soon):**
/alerts - Configure price alerts
/set_alert - Set custom alert price

**Support:**
/help - Show this help message
/feedback - Send feedback to team

Use /start to return to main menu.`
  );
});

// Price command - fetch from API
bot.command('price', async (ctx) => {
  try {
    ctx.sendChatAction('typing');

    const response = await axios.get(`${API_BASE_URL}/api/public/stats`);
    const { token } = response.data;

    const message = `
💰 **DSHIT Token Price**

Price: ${token.price}
Market Cap: ${token.marketCap}
24h Volume: ${token.volume24h}
24h Change: ${token.change24h}
7d Change: ${token.change7d}

Holders: ${token.holders.toLocaleString()}
Supply: ${token.supply}
Circulating: ${token.circulating}

[Buy on Uniswap](https://uniswap.exchange) | [View Chart](https://dexscreener.com)
    `.trim();

    ctx.replyWithMarkdown(message);
  } catch (error) {
    ctx.reply('❌ Error fetching price data. Please try again later.');
    console.error('Price fetch error:', error);
  }
});

// Stats command
bot.command('stats', async (ctx) => {
  try {
    ctx.sendChatAction('typing');

    const response = await axios.get(`${API_BASE_URL}/api/public/stats`);
    const { platform } = response.data;

    const message = `
📊 **dshit.xyz Platform Stats**

Total Memes: ${platform.totalMemes.toLocaleString()}
Active Creators: ${platform.totalCreators.toLocaleString()}
Total Votes: ${platform.totalVotes.toLocaleString()}
Avg Votes/Meme: ${platform.avgVotesPerMeme}
Memes Today: ${platform.memesCreatedToday}

Network: ${platform.deployedNetwork}
Contract: \`${platform.contractAddress.substring(0, 6)}...${platform.contractAddress.substring(-4)}\`

[View Dashboard](https://dshitxyz.vercel.app/dashboard)
    `.trim();

    ctx.replyWithMarkdown(message);
  } catch (error) {
    ctx.reply('❌ Error fetching stats. Please try again later.');
    console.error('Stats fetch error:', error);
  }
});

// Leaderboard command
bot.command('leaderboard', async (ctx) => {
  try {
    ctx.sendChatAction('typing');

    const response = await axios.get(`${API_BASE_URL}/api/public/leaderboard?limit=5&type=creators`);
    const { data } = response.data;

    let message = '🏆 **Top 5 Meme Creators**\n\n';

    data.forEach((entry: any, index: number) => {
      const medal = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index];
      message += `${medal} **${entry.creator}**
   Votes: ${entry.totalVotes.toLocaleString()}
   Memes: ${entry.memesCount}
   Earnings: ${entry.earnings}\n\n`;
    });

    message += '[Full Leaderboard](https://dshitxyz.vercel.app/gallery)';

    ctx.replyWithMarkdown(message);
  } catch (error) {
    ctx.reply('❌ Error fetching leaderboard. Please try again later.');
    console.error('Leaderboard fetch error:', error);
  }
});

// Meme creation link
bot.command('meme', (ctx) => {
  ctx.replyWithMarkdown(
    `🎨 **Create a Meme**

Use our web app to create and share memes with the community!

[Open Meme Creator](https://dshitxyz.vercel.app/meme-creator)

Features:
• Select from templates
• Add custom text
• Upload custom images
• Download as PNG/GIF
• Share on social media`
  );
});

// Shop link
bot.command('shop', (ctx) => {
  ctx.replyWithMarkdown(
    `🛍 **Shop Products**

Browse and purchase products with DSHIT tokens!

[Open Shop](https://dshitxyz.vercel.app/products)

Features:
• Browse product catalog
• Add to cart
• Checkout with DSHIT
• Track orders`
  );
});

// Dashboard link
bot.command('dashboard', (ctx) => {
  ctx.replyWithMarkdown(
    `📊 **Your Dashboard**

Track your activity, orders, and earnings.

[Open Dashboard](https://dshitxyz.vercel.app/dashboard)

View:
• Your profile
• DSHIT balance
• Order history
• Created memes
• Earnings`
  );
});

// Feedback command
bot.command('feedback', (ctx) => {
  ctx.reply(
    'Thanks for your interest! Feedback functionality coming soon. ' +
      'For now, please reach out on Discord or Twitter.'
  );
});

// Text message handler
bot.on(message('text'), (ctx) => {
  const text = ctx.message.text.toLowerCase();

  if (text.includes('price')) {
    return ctx.scene.enter('price_scene') || ctx.reply('Use /price command');
  }

  // Default response
  ctx.reply(
    "I didn't understand that. Use /help to see available commands or " +
      "/start to return to the main menu."
  );
});

// Error handling
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Start the bot
const startBot = async () => {
  try {
    await bot.launch();
    console.log('🚀 Telegram bot started successfully');
    console.log('API Base URL:', API_BASE_URL);

    // Handle graceful shutdown
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();
