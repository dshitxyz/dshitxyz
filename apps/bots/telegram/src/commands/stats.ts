/**
 * /stats Command
 * Displays platform statistics
 */

import axios from 'axios';
import { Context } from 'telegraf';
import { formatStatsMessage, formatErrorMessage, PlatformStats } from '../utils/formatting';
import { handleApiError, logCommandExecution } from '../utils/errorHandler';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export async function statsCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('stats', ctx.from?.id);

    await ctx.sendChatAction('typing');

    const response = await axios.get(`${API_BASE_URL}/api/public/stats`, {
      timeout: 5000,
    });

    const { platform } = response.data;

    if (!platform) {
      await ctx.replyWithMarkdown(
        formatErrorMessage('fetch platform stats')
      );
      return;
    }

    const stats: PlatformStats = {
      totalMemes: platform.totalMemes || 0,
      totalCreators: platform.totalCreators || 0,
      totalVotes: platform.totalVotes || 0,
      avgVotesPerMeme: platform.avgVotesPerMeme || 0,
      memesCreatedToday: platform.memesCreatedToday || 0,
      deployedNetwork: platform.deployedNetwork || 'Unknown',
      contractAddress: platform.contractAddress || '0x0000000000000000000000000000000000000000',
    };

    await ctx.replyWithMarkdown(formatStatsMessage(stats));
  } catch (error) {
    const errorMessage = handleApiError('stats', error, ctx.from?.id);
    await ctx.replyWithMarkdown(errorMessage);
  }
}
