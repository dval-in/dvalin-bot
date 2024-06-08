import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/command";

export class ClearCommand implements Command {
    name = "clear";
    description = "Bulk delete messages [1-50]";
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("Number of messages to bulk delete (Cannot delete messages older than 2 weeks).")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
        
    async execute(interaction: any): Promise<void> {

        const amount = interaction.options.getInteger("amount") ?? 50;
        const channel = interaction.channel;

        if (!interaction.appPermissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.reply({
                content: "Bot is missing \`Manage Messages\` permission.",
                ephemeral: true
            });
            return;
        }

        if (amount < 1 || amount > 50) {
            interaction.reply({
                content: "Invalid amount. Must be in range \`[1-50]\`, inclusive.",
                ephemeral: true
            });
            return;
        }

        try {
            const fetched = await channel.messages.fetch( {limit: amount} )
            await channel.bulkDelete(fetched);
            await interaction.reply(
                {
                    content: `\`${amount}\` messages have been deleted.`,
                    ephemeral: true
                }
            );                
        } catch (err) {
            await interaction.reply({
                content: "You cannot delete messages older than 14 days.",
                ephemeral: true
            });
        }
    }
}