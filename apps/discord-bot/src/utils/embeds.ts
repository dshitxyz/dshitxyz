import { EmbedBuilder } from 'discord.js';

export function createEmbed(title: string, description?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor('#F4D03F')
    .setTitle(title)
    .setDescription(description || '')
    .setTimestamp()
    .setFooter({ text: 'dshit.xyz' });
}

export function createErrorEmbed(error: string): EmbedBuilder {
  return createEmbed('❌ Error', error).setColor('#FF0000');
}

export function createSuccessEmbed(title: string, description: string): EmbedBuilder {
  return createEmbed(title, description).setColor('#39FF14');
}