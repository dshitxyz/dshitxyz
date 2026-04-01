import type { Context } from 'telegraf';
import dshitApi from '../lib/dshit-api.js';
import logger from '../lib/logger.js';

export async function handleGovernanceCommand(ctx: Context): Promise<void> {
  try {
    const proposals = await dshitApi.getActiveGovernanceProposals();
    
    const message = `
🏛️ **DSHIT Governance**

📊 **Active Proposals:** ${proposals.count}
⏰ **Next Deadline:** ${proposals.nextDeadline}

🗳️ Vote on proposals and shape the future of DSHIT!

👥 **Governance Tiers:**
• Visitor (0 tokens) - Read proposals
• Lurker (1k DSHIT) - Vote on polls
• Native (10k DSHIT) - Create proposals
• Whale (100k DSHIT) - Create major proposals

Vote now: 🔗 https://dshit.xyz/governance
    `.trim();
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
    logger.info('Governance command executed', { userId: ctx.from?.id });
  } catch (error) {
    logger.error('Governance command failed', { error, userId: ctx.from?.id });
    await ctx.reply('❌ Failed to fetch governance status. Please try again later.');
  }
}

export async function handleVotingStatus(ctx: Context, walletAddress?: string): Promise<void> {
  try {
    if (!walletAddress) {
      await ctx.reply('❌ Please provide your wallet address to check voting power.\n\nUsage: /voting <0x...>');
      return;
    }
    
    const govStatus = await dshitApi.getGovernanceStatus(walletAddress);
    
    const message = `
🗳️ **Your Voting Power**

💰 **Staked DSHIT:** ${govStatus.stakedAmount}
⚡ **Voting Power:** ${govStatus.votingPower}
📝 **Active Proposals:** ${govStatus.activeProposals}
⏰ **Next Deadline:** ${govStatus.nextProposalDeadline}

Vote on active proposals:
🔗 https://dshit.xyz/governance
    `.trim();
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
    logger.info('Voting status requested', { userId: ctx.from?.id, walletAddress });
  } catch (error) {
    logger.error('Voting status failed', { error, userId: ctx.from?.id, walletAddress });
    await ctx.reply('❌ Failed to fetch voting status. Please verify your wallet address.');
  }
}

export async function handleProposalNotification(ctx: Context, proposalTitle: string, votingDeadline: string): Promise<void> {
  try {
    const message = `
🆕 **New Governance Proposal**

📋 **Title:** ${proposalTitle}
⏰ **Voting Deadline:** ${votingDeadline}

Vote now to shape DSHIT's future!
🔗 https://dshit.xyz/governance
    `.trim();
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
    logger.info('Proposal notification sent', { proposalTitle });
  } catch (error) {
    logger.error('Proposal notification failed', { error });
  }
}
