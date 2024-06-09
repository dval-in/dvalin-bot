import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/command";

export class BanCommand implements Command {
    name = "ban";
    description = "Ban a user.";
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption((option) => 
            option
                .setName("user")
                .setDescription("User to ban.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
    
    async execute(interaction: any): Promise<void> {

        const user = interaction.options.getUser("user");
        const guild = interaction.guild;

        if (!interaction.appPermissions.has(PermissionFlagsBits.BanMembers)) {
            await interaction.reply({
                content: "Bot is missing \`Ban Members\` permission.",
                ephemeral: true
            });
            return;
        }

        if (!user) {
            await interaction.reply({
                content: "Invalid user.",
                ephemeral: true
            });
            return;
        }

        if (user.bot) {
            await interaction.reply({
                content: "Cannot ban bots.",
                ephemeral: true
            });
            return;
        }

        guild.members.ban(user);
        await interaction.reply({
            content: `User ${user} has been banned.`,
            ephemeral: true
        });
    }
}