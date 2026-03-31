import { CommandInteraction, EmbedBuilder } from "discord.js";
import axios from "axios";

const API_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function leaderboardCommand(
  interaction: CommandInteraction
): Promise<void> {
  try {
    const type =
      (interaction.options.getString("type") as string) || "creators";

    const response = await axios.get(
      `${API_URL}/api/public/leaderboard`,
      {
        params: { type, limit: 10 },
      }
    );

    const entries = response.data || [];

    if (entries.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(0xf4d03f)
        .setTitle(`🏆 ${type === "creators" ? "Top Creators" : "Top Holders"}`)
        .setDescription("No entries found.")
        .setFooter({ text: "dshit.xyz" });

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const leaderboardText = entries
      .map(
        (entry: { rank?: number; name?: string; value?: number }, i: number) =>
          `${i + 1}. ${entry.name || "Unknown"} - ${
            type === "creators"
              ? `${entry.value || 0} memes`
              : `${(entry.value || 0).toLocaleString()} DSHIT`
          }`
      )
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0xf4d03f)
      .setTitle(
        `🏆 Top ${type === "creators" ? "Creators" : "Holders"}`
      )
      .setDescription(`\`\`\`\n${leaderboardText}\n\`\`\``)
      .addFields({
        name: "View Full Leaderboard",
        value: "[Open on dshit.xyz](https://dshitxyz.vercel.app/leaderboard)",
      })
      .setFooter({
        text: "dshit.xyz • Updated hourly",
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Leaderboard command error:", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error Fetching Leaderboard")
      .setDescription("Could not fetch leaderboard data. Try again later.")
      .setFooter({ text: "dshit.xyz" });

    await interaction.editReply({ embeds: [embed] });
  }
}
