import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { createEmbed, logCommand } from '../utils';

const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View platform metrics and statistics')
  .toJSON();

async function execute(interaction: any) {
  try {
    await interaction.deferReply();
    logCommand('stats', interaction.user.id);

    const apiUrl = process.env.DSHIT_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/public/stats`, { timeout: 5000 }).catch(() => ({}));
    const { total_users = 0, total_volume = 0, active_proposals = 0, meme_count = 0 } = response.data || {};

    const embed = createEmbed('📊 Platform Stats')
      .addFields(
        { name: '👥 Total Users', value: `${total_users.toLocaleString()}`, inline: true },
        { name: '💵 Total Volume', value: `$${(total_volume / 1e6).toFixed(2)}M`, inline: true },
        { name: '🗳️ Active Proposals', value: `${active_proposals}`, inline: true },
        { name: '🎪 Memes Created', value: `${meme_count.toLocaleString()}`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Stats command error:', error);
    await interaction.editReply({
      content: '❌ Failed to fetch statistics. Please try again later.'
    }).catch(() => {});
  }
}

export default { data, execute };