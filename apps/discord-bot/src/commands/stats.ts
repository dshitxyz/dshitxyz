import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { createEmbed, logCommand } from '../utils';

const command = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View platform metrics and statistics');

export async function execute(interaction: any) {
  try {
    await interaction.deferReply();
    logCommand('stats', interaction.user.id);

    const apiUrl = process.env.DSHIT_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/public/stats`, { timeout: 5000 });
    const { total_users, total_volume, active_proposals, meme_count } = response.data;

    const embed = createEmbed('📊 Platform Stats')
      .addFields(
        { name: '👥 Total Users', value: `${(total_users || 0).toLocaleString()}`, inline: true },
        { name: '💵 Total Volume', value: `$${((total_volume || 0) / 1e6).toFixed(2)}M`, inline: true },
        { name: '🗳️ Active Proposals', value: `${active_proposals || 0}`, inline: true },
        { name: '🎪 Memes Created', value: `${(meme_count || 0).toLocaleString()}`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Stats command error:', error);
    await interaction.editReply({
      embeds: [
        createEmbed('❌ Error', 'Failed to fetch statistics').setColor('#FF0000')
      ]
    });
  }
}

export default { data: command.toJSON(), execute };