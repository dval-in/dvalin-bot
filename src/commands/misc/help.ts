import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../command";

export class HelpCommand implements Command {
    name = "help";
    description = "Get help with and see general information about Dvalin";
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);
    
    async execute(interaction: any): Promise<void> {
        const info = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Help")
            .setDescription("Dvalin is a reliable discord helper for [dval.in](https://dval.in).")
            .addFields(
                {
                    name: "Moderator Commands",
                    value: `\`/giveaway\`: Creates a giveaway.`
                },
                {
                    name: "Misc Commands",
                    value:
                    `
                    \`/help\`: Shows info about the discord bot. 
                    \`/ping\`: Pings the bot to check online status.
                    `
                },
            )
            .setTimestamp();
        await interaction.reply({ embeds: [info] } );
    }
}