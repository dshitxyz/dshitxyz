import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { createEmbed, logCommand } from '../utils';

const data = new SlashCommandBuilder()
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
  )
  .toJSON();

async function execute(interaction: any) {
  try {
    await interaction.deferReply();
    const category = interaction.options.getString('category') || 'creators';
    logCommand('leaderboard', interaction.user.id, category);

    const apiUrl = process.env.DSHIT_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/public/leaderboard/${category}`, { timeout: 5000 }).catch(() => ({}));
    const users = response.data?.users || [];

    const leaderboardText = users
      .slice(0, 10)
      .map((u: any, i: number) => `${i + 1}. **${u.username}** — ${u.score.toLocaleString()} pts`)
      .join('\n') || 'No data available';

    const embed = createEmbed(`🏆 ${category.charAt(0).toUpperCase() + category.slice(1)} Leaderboard`)
      .setDescription(leaderboardText);

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Leaderboard error:', error);
    await interaction.editReply({
      content: '❌ Failed to fetch leaderboard. Please try again later.'
    }).catch(() => {});
  }
}

export default { data, execute };