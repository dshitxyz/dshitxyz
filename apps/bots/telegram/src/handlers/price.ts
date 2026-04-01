import type { Context } from 'telegraf';
import dshitApi from '../lib/dshit-api.js';
import logger from '../lib/logger.js';

export async function handlePriceCommand(ctx: Context): Promise<void> {
  try {
    const price = await dshitApi.getTokenPrice();
    
    const changeEmoji = price.change24h >= 0 ? '📈' : '📉';
    const priceFormatted = `$${price.current.toFixed(6)}`;
    const changeFormatted = `${price.change24h >= 0 ? '+' : ''}${price.change24h.toFixed(2)}%`;
    
    const message = `
💰 **$DSHIT Token Price** 💰

${changeEmoji} **Current Price:** ${priceFormatted}
📊 **24h Change:** ${changeFormatted}
🪙 **Market Cap:** ${price.marketCap}
📈 **24h Volume:** ${price.volume24h}

🔗 Trade on: https://uniswap.dshit.xyz
    `.trim();
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
    logger.info('Price command executed', { userId: ctx.from?.id });
  } catch (error) {
    logger.error('Price command failed', { error, userId: ctx.from?.id });
    await ctx.reply('❌ Failed to fetch price data. Please try again later.');
  }
}

export async function handlePriceAlert(ctx: Context): Promise<void> {
  try {
    const message = `
🔔 **Price Alert Settings**

React with:
✅ - Enable price alerts
❌ - Disable price alerts

You'll be notified when $DSHIT moves 5% in either direction.
    `.trim();
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
    logger.info('Price alert command executed', { userId: ctx.from?.id });
  } catch (error) {
    logger.error('Price alert command failed', { error, userId: ctx.from?.id });
    await ctx.reply('❌ Failed to set price alerts. Please try again later.');
  }
}
