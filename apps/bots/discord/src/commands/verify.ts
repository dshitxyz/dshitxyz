import { CommandInteraction, EmbedBuilder } from "discord.js";
import { verifyTokenHolder } from "../utils/verification.js";

export async function verifyCommand(
  interaction: CommandInteraction
): Promise<void> {
  try {
    const userId = interaction.user.id;

    // Get user's wallet from database or ask them to connect
    const embed = new EmbedBuilder()
      .setColor(0xf4d03f)
      .setTitle("🔐 Token Holder Verification")
      .setDescription(
        "To verify your token holdings and get access to exclusive roles:"
      )
      .addFields(
        {
          name: "Step 1",
          value:
            "Visit [dshit.xyz](https://dshitxyz.vercel.app) and connect your wallet",
        },
        {
          name: "Step 2",
          value: "Go to your dashboard and link your Discord account",
        },
        {
          name: "Step 3",
          value:
            "Return here and we'll automatically assign your role based on holdings",
        }
      )
      .addFields({
        name: "Tier Requirements",
        value: `
🐻 Degen: 1,000+ DSHIT
🦁 Whale: 100,000+ DSHIT
👑 Mega: 1,000,000+ DSHIT
        `.trim(),
      })
      .setFooter({
        text: "dshit.xyz • Verification is instant and secure",
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    // Log verification attempt
    console.log(
      `Verification attempt from user ${userId} in guild ${interaction.guildId}`
    );
  } catch (error) {
    console.error("Verify command error:", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Verification Error")
      .setDescription("Could not process verification. Please try again later.")
      .setFooter({ text: "dshit.xyz" });

    await interaction.editReply({ embeds: [embed] });
  }
}
