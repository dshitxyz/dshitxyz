import type { CommandInteraction } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

export async function handleContests(interaction: CommandInteraction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  try {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'current') {
      const embed = new EmbedBuilder()
        .setColor(0xF4D03F)
        .setTitle('🏆 Weekly Meme Contest')
        .setDescription('Vote for your favorite memes and earn $DSHIT!')
        .addFields(
          { name: '📋 Theme', value: 'Most Shitposted Meme', inline: true },
          { name: '⏰ Ends', value: 'Friday 11:59 PM UTC', inline: true },
          { name: '🎁 Prize Pool', value: '50,000 $DSHIT', inline: false },
          {
            name: '💰 Prizes',
            value: '🥇 25k | 🥈 15k | 🥉 10k',
            inline: false
          },
          {
            name: '📤 Submit',
            value: 'Use `/meme` or visit https://dshit.xyz/meme-creator',
            inline: false
          }
        )
        .setThumbnail('https://dshit.xyz/assets/trophy.png');

      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'leaderboard') {
      const leaderboardEmbed = new EmbedBuilder()
        .setColor(0xF4D03F)
        .setTitle('🏅 Leaderboard')
        .setDescription('Top meme creators this week')
        .addFields(
          { name: '🥇 1st', value: '@Creator1 - 450 votes', inline: false },
          { name: '🥈 2nd', value: '@Creator2 - 380 votes', inline: false },
          { name: '🥉 3rd', value: '@Creator3 - 320 votes', inline: false },
          { name: '4th', value: '@Creator4 - 250 votes', inline: false },
          { name: '5th', value: '@Creator5 - 180 votes', inline: false }
        );

      await interaction.reply({ embeds: [leaderboardEmbed] });
    } else {
      await interaction.reply({
        content: '❌ Unknown subcommand.',
        ephemeral: true
      });
    }
  } catch (error) {
    console.error('Contests command error:', error);
    await interaction.reply({
      content: '❌ An error occurred while fetching contest info.',
      ephemeral: true
    });
  }
}
