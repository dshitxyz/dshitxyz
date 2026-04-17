import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import { createEmbed, logCommand } from '../utils';

const command = new SlashCommandBuilder()
  .setName('price')
  .setDescription('Get real-time DSHIT token price and market data');

export async function execute(interaction: any) {
  try {
    await interaction.deferReply();
    logCommand('price', interaction.user.id);

    const apiUrl = process.env.DSHIT_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/public/price`, { timeout: 5000 });
    const { price, change24h, market_cap, volume } = response.data;

    const embed = createEmbed('💰 Price')
      .addFields(
        { name: '💰 Current Price', value: `$${(price || 0).toFixed(4)}`, inline: true },
        { name: '📈 24h Change', value: `${change24h > 0 ? '+' : ''}${(change24h || 0).toFixed(2)}%`, inline: true },
        { name: '🏦 Market Cap', value: `$${((market_cap || 0) / 1e6).toFixed(2)}M`, inline: true },
        { name: '📊 Volume (24h)', value: `$${((volume || 0) / 1e6).toFixed(2)}M`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Price command error:', error);
    await interaction.editReply({
      embeds: [
        createEmbed('❌ Error', 'Failed to fetch price data').setColor('#FF0000')
      ]
    });
  }
}

export default { data: command.toJSON(), execute };