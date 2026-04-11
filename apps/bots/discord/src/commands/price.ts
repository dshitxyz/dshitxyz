import { CommandInteraction, EmbedBuilder } from "discord.js";
import axios from "axios";

const API_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function priceCommand(
  interaction: CommandInteraction
): Promise<void> {
  try {
    // Fetch price data from public API
    const response = await axios.get(`${API_URL}/api/public/stats`);
    const { price, change24h, marketCap, volume24h } = response.data;

    const embed = new EmbedBuilder()
      .setColor(0xf4d03f) // Shit Yellow
      .setTitle("💩 DSHIT Token Price")
      .addFields(
        {
          name: "Current Price",
          value: `$${price ? price.toFixed(8) : "N/A"}`,
          inline: true,
        },
        {
          name: "24h Change",
          value: `${change24h ? (change24h > 0 ? "📈 +" : "📉 ") + change24h.toFixed(2) + "%" : "N/A"}`,
          inline: true,
        },
        {
          name: "Market Cap",
          value: `$${marketCap ? (marketCap / 1e6).toFixed(2) + "M" : "N/A"}`,
          inline: true,
        },
        {
          name: "24h Volume",
          value: `$${volume24h ? (volume24h / 1e6).toFixed(2) + "M" : "N/A"}`,
          inline: true,
        }
      )
      .setFooter({
        text: "dshit.xyz • Updated every 5 minutes",
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Price command error:", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000) // Red
      .setTitle("❌ Error Fetching Price")
      .setDescription(
        "Could not fetch price data. Try again in a few moments."
      )
      .setFooter({ text: "dshit.xyz" });

    await interaction.editReply({ embeds: [embed] });
  }
}
