import { Client, GatewayIntentBits, Collection, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { handleVerify } from './commands/verify.js';
import { handleContests } from './commands/contests.js';
import { handleGovote } from './commands/govote.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  throw new Error('DISCORD_TOKEN and DISCORD_CLIENT_ID environment variables are required');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Store commands in a Collection
const commands = new Collection();

// Define slash commands
const slashCommands = [
  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your wallet and get roles based on your $DSHIT balance')
    .addStringOption(option =>
      option
        .setName('wallet')
        .setDescription('Your Ethereum wallet address')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('contests')
    .setDescription('View meme contests and leaderboard')
    .addSubcommand(subcommand =>
      subcommand
        .setName('current')
        .setDescription('View the current meme contest')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('leaderboard')
        .setDescription('View the top meme creators')
    ),

  new SlashCommandBuilder()
    .setName('govote')
    .setDescription('Check governance proposals and voting power')
    .addSubcommand(subcommand =>
      subcommand
        .setName('active')
        .setDescription('View active governance proposals')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('voting-power')
        .setDescription('Check your voting power')
        .addStringOption(option =>
          option
            .setName('wallet')
            .setDescription('Your Ethereum wallet address')
            .setRequired(true)
        )
    )
];

// Register commands with Discord
async function registerCommands(): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: slashCommands.map(cmd => cmd.toJSON()) }
    );
    console.log('✅ Slash commands registered successfully');
  } catch (error) {
    console.error('Failed to register commands:', error);
    process.exit(1);
  }
}

// Handle ready event
client.once('ready', () => {
  console.log(`✅ Discord bot logged in as ${client.user?.tag}`);
});

// Handle interactions (slash commands)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case 'verify':
        await handleVerify(interaction);
        break;
      case 'contests':
        await handleContests(interaction);
        break;
      case 'govote':
        await handleGovote(interaction);
        break;
      default:
        await interaction.reply({
          content: '❌ Unknown command',
          ephemeral: true
        });
    }
  } catch (error) {
    console.error('Command execution error:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: '❌ An error occurred while executing this command.',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '❌ An error occurred while executing this command.',
        ephemeral: true
      });
    }
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

// Login and register commands
(async () => {
  try {
    await registerCommands();
    await client.login(token);
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
})();

export default client;
