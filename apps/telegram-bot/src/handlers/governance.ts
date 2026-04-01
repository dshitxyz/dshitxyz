import { Telegraf } from 'telegraf';
import axios from 'axios';
import logger from '../utils/logger';
import { formatGovernanceReminder } from '../utils/formatters';

/**
 * Handle proposals command
 */
export async function handleProposals(ctx: any): Promise<void> {
  try {
    ctx.sendChatAction('typing');

    // TODO: Fetch active proposals from API
    const apiUrl = process.env.DSHIT_API_URL || 'http://localhost:3001';
    const proposals = await axios.get(
      `${apiUrl}/api/governance/proposals?status=voting`,
      { timeout: 5000 }
    ).then(r => r.data).catch(() => ({
      proposals: [
        {
          id: 'PROP-001',
          title: 'Increase treasury allocation to governance rewards',
          status: 'voting',
          votesFor: 1200,
          votesAgainst: 340,
          deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      ],
    }));

    if (!proposals.proposals || proposals.proposals.length === 0) {
      await ctx.reply('🗳️ No active proposals at this time.');
      return;
    }

    let message = '🗳️ *Active Proposals*\n\n';
    proposals.proposals.forEach((proposal: any) => {
      const deadline = new Date(proposal.deadline);
      const hoursRemaining = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60));
      message += `*${proposal.title}*\n`;
      message += `ID: \`${proposal.id}\`\n`;
      message += `For: ${proposal.votesFor} | Against: ${proposal.votesAgainst}\n`;
      message += `⏰ ${hoursRemaining}h remaining\n`;
      message += `Status: *${proposal.status}*\n\n`;
    });

    message += 'Use /vote to cast your vote.';
    await ctx.reply(message, { parse_mode: 'Markdown' });
    logger.info('Proposals command executed', { userId: ctx.from.id });
  } catch (error) {
    logger.error('Proposals command error', {
      userId: ctx.from.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await ctx.reply('❌ Failed to fetch proposals. Please try again later.');
  }
}

/**
 * Handle vote command
 */
export async function handleVote(ctx: any): Promise<void> {
  try {
    // TODO: Fetch proposals and show voting options
    await ctx.reply(
      '🗳️ *Voting*\n\n' +
        'Use /proposals to see active proposals first.\n' +
        'Reply with the proposal ID and your vote (for/against/abstain).',
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    logger.error('Vote command error', {
      userId: ctx.from.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await ctx.reply('❌ Failed to process vote command. Please try again later.');
  }
}

/**
 * Send governance reminder to user
 * Called periodically for upcoming deadlines
 */
export async function sendGovernanceReminder(
  bot: Telegraf,
  userId: number,
  proposalId: string,
  title: string,
  hoursRemaining: number
): Promise<void> {
  try {
    const timeRemaining = `${hoursRemaining}h`;
    const message = formatGovernanceReminder(proposalId, title, timeRemaining);
    await bot.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' });
    logger.info('Governance reminder sent', { userId, proposalId, hoursRemaining });
  } catch (error) {
    logger.error('Failed to send governance reminder', {
      userId,
      proposalId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Register governance command handlers
 */
export function governanceHandler(bot: Telegraf): void {
  bot.command('proposals', handleProposals);
  bot.command('vote', handleVote);

  // TODO: Setup scheduled reminders for proposal deadlines
}
