import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../command";

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

        if (amount > 50 || amount < 1) {
            await interaction.reply(
                {
                    content: "Invalid amount entered.",
                    ephemeral: true
                }
            );
        } else {
            const fetched = await channel.messages.fetch( {limit: amount} )
            await channel.bulkDelete(fetched);
            await interaction.reply(
                {
                    content: `\`${amount}\` messages have been deleted.`,
                    ephemeral: true
                }
            );                
        }
    }
}