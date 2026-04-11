/**
 * Alert Commands
 * /set_alert, /alerts, /remove_alert
 */

import { Context } from 'telegraf';
import { alertService, UserAlert } from '../services/alerts';
import {
  formatAlertCreatedMessage,
  formatSuccessMessage,
  formatErrorMessage,
} from '../utils/formatting';
import {
  handleCommandError,
  logCommandExecution,
  validateInput,
} from '../utils/errorHandler';

export async function setAlertCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('set_alert', ctx.from?.id);

    const messageText = (ctx.message as any)?.text || '';
    const args = messageText.split(' ') || [];
    const priceStr = args[1];

    if (!priceStr) {
      await ctx.reply('Usage: /set_alert <price>\nExample: /set_alert 0.50');
      return;
    }

    // Validate input
    const validationError = validateInput(priceStr, 'price');
    if (validationError) {
      await ctx.reply(`❌ Invalid input: ${validationError}`);
      return;
    }

    const targetPrice = parseFloat(priceStr);
    const userId = ctx.from?.id;

    if (!userId) {
      await ctx.reply('❌ Unable to identify your user ID.');
      return;
    }

    // Create alert
    const alert = alertService.createAlert(userId, targetPrice);

    await ctx.replyWithMarkdown(formatAlertCreatedMessage(alert.id, targetPrice));
  } catch (error) {
    const errorMessage = handleCommandError('set_alert', error, ctx.from?.id);
    await ctx.reply(errorMessage);
  }
}

export async function alertsCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('alerts', ctx.from?.id);

    const userId = ctx.from?.id;

    if (!userId) {
      await ctx.reply('❌ Unable to identify your user ID.');
      return;
    }

    const userAlerts = alertService.getUserAlerts(userId);

    if (userAlerts.length === 0) {
      await ctx.reply(
        "You don't have any active alerts.\n\nUse /set_alert <price> to create one."
      );
      return;
    }

    let message = `🔔 **Your Price Alerts** (${userAlerts.length} active)\n\n`;

    userAlerts.forEach((alert, index) => {
      message += alertService.formatAlert(alert, index + 1) + '\n\n';
    });

    message +=
      'Use /remove_alert <id> to delete an alert.\nUse /set_alert <price> to add more alerts.';

    await ctx.replyWithMarkdown(message);
  } catch (error) {
    const errorMessage = handleCommandError('alerts', error, ctx.from?.id);
    await ctx.reply(errorMessage);
  }
}

export async function removeAlertCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('remove_alert', ctx.from?.id);

    const messageText = (ctx.message as any)?.text || '';
    const args = messageText.split(' ') || [];
    const alertId = args[1];

    if (!alertId) {
      await ctx.reply('Usage: /remove_alert <alert_id>\nExample: /remove_alert alert_1');
      return;
    }

    const userId = ctx.from?.id;

    if (!userId) {
      await ctx.reply('❌ Unable to identify your user ID.');
      return;
    }

    const removed = alertService.removeAlert(userId, alertId);

    if (!removed) {
      await ctx.reply(`❌ Alert ${alertId} not found.`);
      return;
    }

    await ctx.reply(formatSuccessMessage('Alert removed!', `Removed alert ${alertId}`));
  } catch (error) {
    const errorMessage = handleCommandError('remove_alert', error, ctx.from?.id);
    await ctx.reply(errorMessage);
  }
}
