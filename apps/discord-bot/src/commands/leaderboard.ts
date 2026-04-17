import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { createEmbed, logCommand } from '../utils';

const command = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('View community rankings')
  .addStringOption(option =>
    option
      .setName('category')
      .setDescription('Leaderboard category')
      .setRequired(false)
      .addChoices(
        { name: 'Meme Creators', value: 'creators' },
        { name: 'Token Holders', value: 'holders' },
        { name: 'Governance Voters', value: 'voters' }
      )
  );

export async function execute(interaction: any) {
  try {
    await interaction.deferReply();
    const category = interaction.options.getString('category') || 'creators';
    logCommand('leaderboard', interaction.user.id, category);

    const apiUrl = process.env.DSHIT_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/public/leaderboard/${category}`, { timeout: 5000 });
    const { users } = response.data;

    const leaderboardText = (users || [])
      .slice(0, 10)
      .map((u: any, i: number) => `${i + 1}. **${u.username}** — ${(u.score || 0).toLocaleString()} pts`)
      .join('\n');

    const embed = createEmbed(`🏆 ${category.charAt(0).toUpperCase() + category.slice(1)} Leaderboard`)
      .setDescription(leaderboardText || 'No data available');

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    await interaction.editReply({
      embeds: [
        createEmbed('❌ Error', 'Failed to fetch leaderboard').setColor('#FF0000')
      ]
    });
  }
}

export default { data: command.toJSON(), execute };