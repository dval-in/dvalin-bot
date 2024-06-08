import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/command";

export class PingCommand implements Command {
	name = "ping";
	description = "Replies with Pong!";
	slashCommandConfig = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)
		.addChannelOption((option) =>
			option.setName("channel").setDescription("The channel to echo into").setRequired(true)
		)
		.addStringOption((option) => option.setName("input").setDescription("The input to echo back"));

	async execute(interaction: any): Promise<void> {
		const input = interaction.options.getString("input");
		const channel = interaction.options.getChannel("channel");

		await channel.send(`${interaction.user.username}\nDuration: ${interaction.duration}\n your input: ${input}`);
		await interaction.reply({ content: "Message sent to the specified channel!", ephemeral: true });
	}
}
