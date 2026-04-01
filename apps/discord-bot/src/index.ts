import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, ChannelType } from 'discord.js';
import logger from './utils/logger';
import { DiscordConfig } from './types';
import { registerCommands } from './commands';

/**
 * Validate bot configuration
 */
function validateConfig(): DiscordConfig {
  const requiredEnvVars = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID', 'DSHIT_API_URL'];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    token: process.env.DISCORD_TOKEN!,
    clientId: process.env.DISCORD_CLIENT_ID!,
    guildId: process.env.DISCORD_GUILD_ID!,
    apiUrl: process.env.DSHIT_API_URL!,
    logLevel: process.env.LOG_LEVEL || 'info',
    environment: (process.env.NODE_ENV as any) || 'development',
  };
}

/**
 * Initialize Discord Bot
 */
async function startBot(): Promise<void> {
  try {
    const config = validateConfig();
    logger.info('Initializing Discord Bot', { environment: config.environment });

    // Create client with intents
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    // Event: Ready
    client.once('ready', () => {
      logger.info('Discord Bot is ready', {
        username: client.user?.username,
        tag: client.user?.tag,
        id: client.user?.id,
      });
    });

    // Event: Error
    client.on('error', (error) => {
      logger.error('Discord client error', {
        error: error.message,
        stack: error.stack,
      });
    });

    // Event: Warn
    client.on('warn', (message) => {
      logger.warn('Discord warning', { message });
    });

    // Event: InteractionCreate
    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      try {
        logger.info('Command executed', {
          commandName: interaction.commandName,
          userId: interaction.user.id,
          guildId: interaction.guildId,
        });

        // Commands will be handled here
        // TODO: Implement command routing
      } catch (error) {
        logger.error('Command error', {
          commandName: interaction.commandName,
          userId: interaction.user.id,
          error: error instanceof Error ? error.message : String(error),
        });

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ An error occurred while executing this command.',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: '❌ An error occurred while executing this command.',
            ephemeral: true,
          });
        }
      }
    });

    // Register slash commands
    logger.info('Registering slash commands');
    const rest = new REST({ version: '10' }).setToken(config.token);
    const commandData = await registerCommands();

    if (commandData.length > 0) {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commandData }
      );
      logger.info('Slash commands registered', { count: commandData.length });
    }

    // Login
    logger.info('Logging in to Discord');
    await client.login(config.token);

    // Graceful shutdown
    process.once('SIGINT', () => {
      logger.info('Graceful shutdown initiated');
      client.destroy();
      process.exit(0);
    });

    process.once('SIGTERM', () => {
      logger.info('Graceful shutdown initiated');
      client.destroy();
      process.exit(0);
    });

    logger.info('Discord Bot started successfully');
  } catch (error) {
    logger.error('Failed to start bot', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// Start the bot
startBot().catch((error) => {
  logger.error('Unexpected error', { error: error instanceof Error ? error.message : String(error) });
  process.exit(1);
});
