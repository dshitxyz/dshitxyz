/**
 * /leaderboard Command
 * Displays top creators and holders
 */

import axios from 'axios';
import { Context } from 'telegraf';
import { formatLeaderboardMessage, formatErrorMessage, LeaderboardEntry } from '../utils/formatting';
import { handleApiError, logCommandExecution } from '../utils/errorHandler';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export async function leaderboardCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('leaderboard', ctx.from?.id);

    await ctx.sendChatAction('typing');

    // Get leaderboard type from command args (default: creators)
    const messageText = (ctx.message as any)?.text || '';
    const args = messageText.split(' ') || [];
    const type = args[1]?.toLowerCase() || 'creators';

    const response = await axios.get(
      `${API_BASE_URL}/api/public/leaderboard?limit=5&type=${type}`,
      {
        timeout: 5000,
      }
    );

    const { data } = response.data;

    if (!Array.isArray(data) || data.length === 0) {
      await ctx.replyWithMarkdown(
        '📊 No leaderboard data available. Please try again later.'
      );
      return;
    }

    // Ensure data has required fields
    const entries: LeaderboardEntry[] = data
      .filter((entry: any) => entry.creator)
      .map((entry: any) => ({
        creator: entry.creator || 'Anonymous',
        totalVotes: entry.totalVotes || 0,
        memesCount: entry.memesCount || 0,
        earnings: entry.earnings || '$0',
      }));

    if (entries.length === 0) {
      await ctx.replyWithMarkdown(
        '📊 No leaderboard data available. Please try again later.'
      );
      return;
    }

    await ctx.replyWithMarkdown(formatLeaderboardMessage(entries));
  } catch (error) {
    const errorMessage = handleApiError('leaderboard', error, ctx.from?.id);
    await ctx.replyWithMarkdown(errorMessage);
  }
}
