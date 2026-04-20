import { CommandInteraction, EmbedBuilder } from "discord.js";
import axios from "axios";

const API_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function statsCommand(
  interaction: CommandInteraction
): Promise<void> {
  try {
    const response = await axios.get(`${API_URL}/api/public/stats`);
    const stats = response.data || {};

    const embed = new EmbedBuilder()
      .setColor(0xf4d03f) // Shit Yellow
      .setTitle("📊 Platform Statistics")
      .addFields(
        {
          name: "Total Holders",
          value: `${stats.holders || 0}`,
          inline: true,
        },
        {
          name: "Total Memes Created",
          value: `${stats.totalMemes || 0}`,
          inline: true,
        },
        {
          name: "Total Orders",
          value: `${stats.totalOrders || 0}`,
          inline: true,
        },
        {
          name: "Token Supply",
          value: `1,000,000,000 DSHIT`,
          inline: true,
        },
        {
          name: "Circulating Supply",
          value: `${stats.circulatingSupply ? (stats.circulatingSupply / 1e9).toFixed(2) : "N/A"}B DSHIT`,
          inline: true,
        },
        {
          name: "Market Cap",
          value: `$${stats.marketCap ? (stats.marketCap / 1e6).toFixed(2) + "M" : "N/A"}`,
          inline: true,
        }
      )
      .setFooter({
        text: "dshit.xyz • Real-time statistics",
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Stats command error:", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error Fetching Stats")
      .setDescription("Could not fetch platform statistics. Try again later.")
      .setFooter({ text: "dshit.xyz" });

    await interaction.editReply({ embeds: [embed] });
  }
}
