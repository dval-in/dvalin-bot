import { SlashCommandBuilder } from "discord.js";
import { Command } from "../command";

export class PingCommand implements Command {
	name = "giveaway";
	description = "Creates a giveaway.";
	slashCommandConfig = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)
		.addChannelOption((option) =>
			option.setName("channel").setDescription("The channel to echo into").setRequired(true)
		)
		.addStringOption((option) => option.setName("duration").setDescription("The duration of the giveaway."))
		.addNumberOption((option) => option.setName("nWinners").setDescription("The number of winners for the giveaway."));

	async execute(interaction: any): Promise<void> {
		const input = interaction.options.getString("input");
		const channel = interaction.options.getChannel("channel");

		await channel.send(`Pong: ${interaction.user.username}\nYour ID: ${interaction.user.id}\n your input: ${input}`);
		await interaction.reply({ content: "Message sent to the specified channel!", ephemeral: true });
	}
}
