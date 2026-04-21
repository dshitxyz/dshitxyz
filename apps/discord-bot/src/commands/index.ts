import { SlashCommandBuilder } from 'discord.js';
import priceCommand from './price';
import statsCommand from './stats';
import leaderboardCommand from './leaderboard';

const commands = [priceCommand, statsCommand, leaderboardCommand];

export async function registerCommands(): Promise<any[]> {
  try {
    return commands.map(cmd => {
      if (!cmd || !cmd.data) {
        throw new Error('Invalid command structure');
      }
      return cmd.data;
    });
  } catch (error) {
    console.error('Error registering commands:', error);
    return [];
  }
}

export { priceCommand, statsCommand, leaderboardCommand };
export default { registerCommands };