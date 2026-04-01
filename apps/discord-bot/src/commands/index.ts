import { SlashCommandBuilder } from 'discord.js';
import logger from '../utils/logger';

/**
 * Define all slash commands
 */
const commands = [
  new SlashCommandBuilder()
    .setName('price')
    .setDescription('Get current DSHIT price and market data'),

  new SlashCommandBuilder()
    .setName('proposals')
    .setDescription('View active governance proposals'),

  new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote on a governance proposal')
    .addStringOption((option) =>
      option
        .setName('proposal_id')
        .setDescription('Proposal ID to vote on')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('choice')
        .setDescription('Your vote')
        .setRequired(true)
        .addChoices(
          { name: 'For', value: 'for' },
          { name: 'Against', value: 'against' },
          { name: 'Abstain', value: 'abstain' }
        )
    ),

  new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View community leaderboard')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('Leaderboard category')
        .setRequired(false)
        .addChoices(
          { name: 'Reputation', value: 'reputation' },
          { name: 'Voting Power', value: 'voting_power' },
          { name: 'Meme Creators', value: 'meme_creators' },
          { name: 'Traders', value: 'traders' }
        )
    ),

  new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your community profile')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to view (defaults to yourself)')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('events')
    .setDescription('View upcoming community events'),

  new SlashCommandBuilder()
    .setName('rules')
    .setDescription('View community rules and guidelines'),

  new SlashCommandBuilder()
    .setName('support')
    .setDescription('Get support or report an issue'),
];

/**
 * Register commands and return JSON data
 */
export async function registerCommands(): Promise<any[]> {
  try {
    const commandData = commands.map((cmd) => {
      const data = cmd.toJSON();
      logger.debug('Command registered', { name: data.name });
      return data;
    });
    return commandData;
  } catch (error) {
    logger.error('Failed to register commands', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
