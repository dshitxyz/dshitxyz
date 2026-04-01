import type { CommandInteraction } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

export async function handleGovote(interaction: CommandInteraction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  try {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'active') {
      const embed = new EmbedBuilder()
        .setColor(0xF4D03F)
        .setTitle('🏛️ Active Governance Proposals')
        .setDescription('Vote on proposals and shape DSHIT\'s future')
        .addFields(
          {
            name: '📋 Proposal 1: Increase Meme Contest Reward Pool',
            value: '⏰ Ends in 2 days | 🗳️ 5,240 votes cast',
            inline: false
          },
          {
            name: '📋 Proposal 2: Launch Partnership Program',
            value: '⏰ Ends in 3 days | 🗳️ 3,150 votes cast',
            inline: false
          },
          {
            name: '📋 Proposal 3: DAO Treasury Allocation',
            value: '⏰ Ends in 4 days | 🗳️ 7,890 votes cast',
            inline: false
          },
          {
            name: '🔗 Vote Now',
            value: 'https://dshit.xyz/governance',
            inline: false
          }
        );

      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'voting-power') {
      const walletAddress = interaction.options.getString('wallet');
      if (!walletAddress) {
        await interaction.reply({
          content: '❌ Please provide your wallet address.',
          ephemeral: true
        });
        return;
      }

      const powerEmbed = new EmbedBuilder()
        .setColor(0xF4D03F)
        .setTitle('🗳️ Your Voting Power')
        .addFields(
          { name: '💰 Staked DSHIT', value: '50,000 DSHIT', inline: true },
          { name: '⚡ Voting Power', value: '75,000 votes', inline: true },
          { name: '📊 Voting Multiplier', value: '1.5x (90-day lock)', inline: true },
          {
            name: '📝 Vote on Proposals',
            value: 'https://dshit.xyz/governance',
            inline: false
          }
        );

      await interaction.reply({
        embeds: [powerEmbed],
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '❌ Unknown subcommand.',
        ephemeral: true
      });
    }
  } catch (error) {
    console.error('Govote command error:', error);
    await interaction.reply({
      content: '❌ An error occurred while fetching governance info.',
      ephemeral: true
    });
  }
}
