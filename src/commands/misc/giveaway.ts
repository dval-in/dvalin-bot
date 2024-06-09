import { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ButtonInteraction,
    ActionRowBuilder, 
    PermissionFlagsBits, 
    ComponentType, 
} from "discord.js";
import { Command } from "../../types/command";

let participants: string[] = [];

export class GiveawayCommand implements Command {
    name = "giveaway";
    description = "Creates a giveaway";
    announcementChannelId = "1248803255077572809";
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addRoleOption((option) => 
            option
                .setName("role")
                .setDescription("The role to create giveaways for.")
                .setRequired(true)
        )
        .addIntegerOption((option) => 
            option
                .setName("duration")
                .setDescription("Amount of time for the giveaway to last.")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName("prize")
                .setDescription("The prize of this giveaway.")
                .setRequired(true)
        )
        .addIntegerOption((option) => 
            option
                .setName("winners")
                .setDescription("Number of people who can win. (Default is 1)")
        ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    
    async execute(interaction: any): Promise<void> {
        const role = interaction.options.getRole("role");
        // TODO: Set up duration checking for different times (minutes, hours, days, weeks, etc.)
        const duration = interaction.options.getInteger("duration"); // milliseconds
        const prize = interaction.options.getString("prize");
        const numWinners = interaction.options.getInteger("winners") ?? 1;

        const guild = interaction.guild;

        const channel = guild.channels.cache.get(this.announcementChannelId);

        const giveawayMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`**${prize}**`)
            .setDescription(`Number of Winners: ${numWinners}.`);

        const enterGiveawayButton = new ButtonBuilder()
            .setCustomId("enterGiveaway")
            .setLabel("Enter Giveaway")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(enterGiveawayButton);

        await interaction.reply(
            {
                content: `Giveaway successfully created for ${role} with ${numWinners} winners for ${duration} seconds, in ${channel}`,
                ephemeral: true
            }
        );

        const response = await channel.send(
            {
                content: `🎉 Giveaway Started! 🎉`,
                embeds: [giveawayMessage],
                components: [row],
            }
        );

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: duration,
        });

        collector.on("collect", async (cInteraction: ButtonInteraction) => {
            if (cInteraction.customId === "enterGiveaway") {

                const giveawayUser = cInteraction.user;
                const userId = giveawayUser.id;

                // TODO: Add check for `@role`.
                if (!participants.includes(userId)) {

                    participants.push(userId);
                    await cInteraction.reply({
                        content: "You have entered the giveaway.",
                        ephemeral: true
                    });
                } else {
                    await cInteraction.reply({
                        content: "You have already entered the giveaway.",
                        ephemeral: true
                    });
                }
            }
        });

        collector.on("end", async () => {

            enterGiveawayButton.setDisabled(true);

            if (participants.length === 0) {

                const noResponse = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`**${prize}**`)
                    .setDescription("No one participated in the giveaway. :frowning:");

                await response.edit({
                    components: [row]
                });
            
                await channel.send({
                    embeds: [noResponse]
                });
                return;
            }

            const winners = [];
            for (let i = 0; i < numWinners; i++) {
                const winnerIndex = Math.floor(Math.random() * participants.length);
                winners.push(participants[winnerIndex]);
                participants.splice(winnerIndex, 1);
            }
            
            const endingEmbed = new EmbedBuilder()
                .setColor(0x444444)
                .setTitle(`**${prize}**`)
                .setDescription(`Winners:\n${winners.map((id) => `<@${id}>`).join("\n")}`)
                .setTimestamp();

            await response.edit({
                content: `Giveaway has ended!`,
                embeds: [endingEmbed],
                components: [row]
            });

            await channel.send({
                content: `Congratulations to ${winners.map((id) => `<@${id}>`).join(", ")}! You have won **${prize}.**`
            });
        });
    }
}