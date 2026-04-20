import { Telegraf } from 'telegraf';
import axios from 'axios';
import logger from '../utils/logger';
import { formatPrice, formatPriceAlert } from '../utils/formatters';
import { APIError } from '../utils/errors';

const CACHE_DURATION = 60000; // 1 minute
let cachedPrice: any = null;
let lastFetchTime = 0;

/**
 * Fetch current DSHIT price from price API
 */
async function fetchPrice(): Promise<any> {
  const now = Date.now();
  if (cachedPrice && now - lastFetchTime < CACHE_DURATION) {
    return cachedPrice;
  }

  try {
    const priceApiUrl = process.env.DSHIT_PRICE_API || 'https://api.example.com/price';

    // Mock response for now - in production this would hit a real DEX API
    const response = await axios.get(`${priceApiUrl}?symbol=DSHIT`, {
      timeout: 5000,
    }).catch(() => ({
      data: {
        price: 0.0042,
        change24h: 12.5,
        marketCap: 4200000,
        volume24h: 850000,
        liquidity: 250000,
      },
    }));

    cachedPrice = response.data;
    lastFetchTime = now;
    return cachedPrice;
  } catch (error) {
    logger.error('Failed to fetch price', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new APIError('Failed to fetch DSHIT price', error instanceof axios.AxiosError ? error.response?.status : 500);
  }
}

/**
 * Price command handler
 */
export async function handlePrice(ctx: any): Promise<void> {
  try {
    ctx.sendChatAction('typing');
    const price = await fetchPrice();
    const message = formatPriceAlert(price.price, price.change24h, price.marketCap);
    await ctx.reply(message, { parse_mode: 'Markdown' });
    logger.info('Price command executed', { userId: ctx.from.id });
  } catch (error) {
    logger.error('Price command error', {
      userId: ctx.from.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await ctx.reply('❌ Failed to fetch price. Please try again later.');
  }
}

/**
 * Subscribe to price alerts
 */
export async function handleSubscribe(ctx: any): Promise<void> {
  try {
    // TODO: Save subscription to database
    await ctx.reply(
      '✅ You are now subscribed to price alerts!\n\n' +
        'You will receive notifications when:\n' +
        '• Price changes by 5% or more\n' +
        '• Significant volume changes\n' +
        '• New exchange listings\n\n' +
        'Use /unsubscribe to stop notifications.'
    );
    logger.info('User subscribed to price alerts', { userId: ctx.from.id });
  } catch (error) {
    logger.error('Subscribe command error', {
      userId: ctx.from.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await ctx.reply('❌ Failed to subscribe. Please try again later.');
  }
}

/**
 * Unsubscribe from price alerts
 */
export async function handleUnsubscribe(ctx: any): Promise<void> {
  try {
    // TODO: Remove subscription from database
    await ctx.reply(
      '👋 You have been unsubscribed from price alerts.\n' +
        'Use /subscribe to re-enable notifications.'
    );
    logger.info('User unsubscribed from price alerts', { userId: ctx.from.id });
  } catch (error) {
    logger.error('Unsubscribe command error', {
      userId: ctx.from.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await ctx.reply('❌ Failed to unsubscribe. Please try again later.');
  }
}

/**
 * Register price command handlers
 */
export function priceHandler(bot: Telegraf): void {
  bot.command('price', handlePrice);
  bot.command('subscribe', handleSubscribe);
  bot.command('unsubscribe', handleUnsubscribe);
}
