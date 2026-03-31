/**
 * /price Command
 * Fetches and displays current DSHIT token price
 */

import axios from 'axios';
import { Context } from 'telegraf';
import { formatPriceMessage, formatErrorMessage, TokenData } from '../utils/formatting';
import { handleApiError, logCommandExecution } from '../utils/errorHandler';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export async function priceCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('price', ctx.from?.id);

    await ctx.sendChatAction('typing');

    const response = await axios.get(`${API_BASE_URL}/api/public/stats`, {
      timeout: 5000,
    });

    const { token } = response.data;

    if (!token) {
      await ctx.replyWithMarkdown(
        formatErrorMessage('fetch price data')
      );
      return;
    }

    const tokenData: TokenData = {
      price: token.price || '$0.00',
      marketCap: token.marketCap || 'N/A',
      volume24h: token.volume24h || 'N/A',
      change24h: token.change24h || 'N/A',
      change7d: token.change7d || 'N/A',
      holders: token.holders || 0,
      supply: token.supply || 'N/A',
      circulating: token.circulating || 'N/A',
    };

    await ctx.replyWithMarkdown(formatPriceMessage(tokenData));
  } catch (error) {
    const errorMessage = handleApiError('price', error, ctx.from?.id);
    await ctx.replyWithMarkdown(errorMessage);
  }
}
