import {
  Client,
  GatewayIntentBits,
  ChannelType,
  EmbedBuilder,
  SlashCommandBuilder,
  CommandInteraction,
  REST,
  Routes,
} from "discord.js";
import "dotenv/config";
import { priceCommand } from "./commands/price.js";
import { memesCommand } from "./commands/memes.js";
import { statsCommand } from "./commands/stats.js";
import { leaderboardCommand } from "./commands/leaderboard.js";
import { verifyCommand } from "./commands/verify.js";

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error(
    "Missing required environment variables: DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID"
  );
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Register command handlers
const commands: Record<
  string,
  (interaction: CommandInteraction) => Promise<void>
> = {
  price: priceCommand,
  memes: memesCommand,
  stats: statsCommand,
  leaderboard: leaderboardCommand,
  verify: verifyCommand,
};

client.once("ready", async () => {
  console.log(`✅ Discord bot logged in as ${client.user?.tag}`);

  // Register slash commands
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    console.log("🔄 Registering slash commands...");

    const slashCommands = [
      new SlashCommandBuilder()
        .setName("price")
        .setDescription("Get current DSHIT token price"),

      new SlashCommandBuilder()
        .setName("memes")
        .setDescription("Show memes from the gallery")
        .addStringOption((option) =>
          option
            .setName("sort")
            .setDescription("Sort by trending, newest, or highest-voted")
            .setChoices(
              { name: "Trending", value: "trending" },
              { name: "Newest", value: "newest" },
              { name: "Highest Voted", value: "voted" }
            )
            .setRequired(false)
        ),

      new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Show platform statistics and metrics"),

      new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Show top creators and holders")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Leaderboard type")
            .setChoices(
              { name: "Creators", value: "creators" },
              { name: "Holders", value: "holders" }
            )
            .setRequired(false)
        ),

      new SlashCommandBuilder()
        .setName("verify")
        .setDescription(
          "Verify your wallet and get token holder role"
        ),
    ];

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: slashCommands }
    );

    console.log("✅ Slash commands registered successfully");
  } catch (error) {
    console.error("❌ Failed to register slash commands:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    await interaction.deferReply({ ephemeral: false });

    const commandHandler = commands[interaction.commandName];
    if (commandHandler) {
      await commandHandler(interaction);
    } else {
      await interaction.editReply(
        "❌ Command not found. Please try again."
      );
    }
  } catch (error) {
    console.error(`❌ Error handling command ${interaction.commandName}:`, error);

    try {
      await interaction.editReply({
        content: "❌ An error occurred while executing this command.",
      });
    } catch {
      console.error("Failed to send error message");
    }
  }
});

client.on("error", (error) => {
  console.error("❌ Discord client error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled promise rejection:", error);
});

client.login(TOKEN).catch((error) => {
  console.error("❌ Failed to login:", error);
  process.exit(1);
});

console.log("🚀 Discord bot starting...");
