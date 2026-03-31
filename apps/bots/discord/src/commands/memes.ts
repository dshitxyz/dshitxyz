import { CommandInteraction, EmbedBuilder } from "discord.js";
import axios from "axios";

const API_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function memesCommand(
  interaction: CommandInteraction
): Promise<void> {
  try {
    const sort =
      (interaction.options.getString("sort") as string) || "trending";

    const response = await axios.get(`${API_URL}/api/public/memes`, {
      params: { sort, limit: 5 },
    });

    const memes = response.data || [];

    if (memes.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(0xf4d03f)
        .setTitle("🎨 Meme Gallery")
        .setDescription("No memes found. Be the first to create one!")
        .setFooter({ text: "dshit.xyz" });

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0xf4d03f)
      .setTitle(`🎨 Top ${sort === "trending" ? "Trending" : sort === "newest" ? "Newest" : "Highest Voted"} Memes`)
      .setDescription(
        memes
          .map(
            (
              meme: {
                id?: string;
                title?: string;
                votes?: number;
              },
              i: number
            ) =>
              `${i + 1}. ${meme.title || "Untitled"} (${meme.votes || 0} votes)`
          )
          .join("\n")
      )
      .addFields({
        name: "View Full Gallery",
        value: "[Open on dshit.xyz](https://dshitxyz.vercel.app/gallery)",
      })
      .setFooter({ text: "dshit.xyz • Meme warfare platform" })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Memes command error:", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error Fetching Memes")
      .setDescription("Could not load memes. Try again later.")
      .setFooter({ text: "dshit.xyz" });

    await interaction.editReply({ embeds: [embed] });
  }
}
