import { Telegraf } from 'telegraf';
import logger from '../utils/logger';

/**
 * Check if user is admin
 */
function isAdmin(userId: number, adminId: number): boolean {
  return userId === adminId;
}

/**
 * Handle /stats command (admin only)
 */
export async function handleStats(adminId: number) {
  return async (ctx: any): Promise<void> => {
    if (!isAdmin(ctx.from.id, adminId)) {
      await ctx.reply('❌ You do not have permission to use this command.');
      return;
    }

    try {
      // TODO: Fetch bot stats
      const stats = {
        totalUsers: 0,
        activeSubscriptions: 0,
        messagesProcessed: 0,
        commandsExecuted: 0,
        errorsToday: 0,
        uptime: '24h',
      };

      let message = '📊 *Bot Statistics*\n\n';
      message += `Total Users: *${stats.totalUsers}*\n`;
      message += `Active Subscriptions: *${stats.activeSubscriptions}*\n`;
      message += `Messages Processed: *${stats.messagesProcessed}*\n`;
      message += `Commands Executed: *${stats.commandsExecuted}*\n`;
      message += `Errors Today: *${stats.errorsToday}*\n`;
      message += `Uptime: *${stats.uptime}*\n`;

      await ctx.reply(message, { parse_mode: 'Markdown' });
      logger.info('Stats command executed by admin', { userId: ctx.from.id });
    } catch (error) {
      logger.error('Stats command error', {
        userId: ctx.from.id,
        error: error instanceof Error ? error.message : String(error),
      });
      await ctx.reply('❌ Failed to fetch statistics.');
    }
  };
}

/**
 * Handle /users command (admin only)
 */
export async function handleUsers(adminId: number) {
  return async (ctx: any): Promise<void> => {
    if (!isAdmin(ctx.from.id, adminId)) {
      await ctx.reply('❌ You do not have permission to use this command.');
      return;
    }

    try {
      // TODO: Fetch user list
      const users = {
        total: 0,
        active: 0,
        subscribed: 0,
      };

      let message = '👥 *User Statistics*\n\n';
      message += `Total Users: *${users.total}*\n`;
      message += `Active Users (24h): *${users.active}*\n`;
      message += `Subscribed Users: *${users.subscribed}*\n`;

      await ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error('Users command error', {
        userId: ctx.from.id,
        error: error instanceof Error ? error.message : String(error),
      });
      await ctx.reply('❌ Failed to fetch user information.');
    }
  };
}

/**
 * Handle /broadcast command (admin only)
 */
export async function handleBroadcast(bot: Telegraf, adminId: number) {
  return async (ctx: any): Promise<void> => {
    if (!isAdmin(ctx.from.id, adminId)) {
      await ctx.reply('❌ You do not have permission to use this command.');
      return;
    }

    try {
      ctx.session = ctx.session || {};
      ctx.session.waitingForBroadcast = true;
      await ctx.reply('📢 Send the message you want to broadcast to all users (or /cancel to abort).');
    } catch (error) {
      logger.error('Broadcast command error', {
        userId: ctx.from.id,
        error: error instanceof Error ? error.message : String(error),
      });
      await ctx.reply('❌ Failed to start broadcast.');
    }
  };
}

/**
 * Register admin command handlers
 */
export function adminHandler(bot: Telegraf, adminId: number): void {
  bot.command('stats', handleStats(adminId));
  bot.command('users', handleUsers(adminId));
  bot.command('broadcast', handleBroadcast(bot, adminId));
}
