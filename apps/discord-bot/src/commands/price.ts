import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { createEmbed, logCommand } from '../utils';

const data = new SlashCommandBuilder()
  .setName('price')
  .setDescription('Get real-time DSHIT token price and market data')
  .toJSON();

async function execute(interaction: any) {
  try {
    await interaction.deferReply();
    logCommand('price', interaction.user.id);

    const apiUrl = process.env.DSHIT_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/public/price`, { timeout: 5000 }).catch(() => ({}));
    const { price = 0, change24h = 0, market_cap = 0, volume = 0 } = response.data || {};

    const embed = createEmbed('💰 Price')
      .addFields(
        { name: '💰 Current Price', value: `$${price.toFixed(4)}`, inline: true },
        { name: '📈 24h Change', value: `${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%`, inline: true },
        { name: '🏦 Market Cap', value: `$${(market_cap / 1e6).toFixed(2)}M`, inline: true },
        { name: '📊 Volume (24h)', value: `$${(volume / 1e6).toFixed(2)}M`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Price command error:', error);
    await interaction.editReply({
      content: '❌ Failed to fetch price data. Please try again later.'
    }).catch(() => {});
  }
}

export default { data, execute };