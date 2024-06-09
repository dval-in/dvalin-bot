import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
	name: string;
	description?: string;
	slashCommandConfig: any;

	execute(interaction: ChatInputCommandInteraction): Promise<any>;
}
