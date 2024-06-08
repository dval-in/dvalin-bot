import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/command";

export class KickCommand implements Command {
    name = "kick";
    description = "Kick a user.";
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to kick.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

    async execute(interaction: any): Promise<void> {

        const user = interaction.options.getUser("user");
        const guild = interaction.guild;

        if (!interaction.appPermissions.has(PermissionFlagsBits.KickMembers)) {
            await interaction.reply({
                content: "Bot is missing \`Kick Members\` permission.",
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
                content: "Cannot kick bots.",
                ephemeral: true
            });
            return;
        }

        try {
            guild.members.kick(user);
            await interaction.reply({
                content: `User ${user} has been kicked.`,
                ephemeral: true
            });

        } catch (err) {
            await interaction.reply({
                content: err,
                ephemeral: true
            });
        }
    }
}