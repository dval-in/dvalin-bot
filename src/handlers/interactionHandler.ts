import { Interaction, ChatInputCommandInteraction, ButtonInteraction } from "discord.js";
import { Command } from "../types/command";
import { PingCommand } from "../commands/misc/ping";
import { HelpCommand } from "../commands/misc/help";
import { ClearCommand } from "../commands/moderation/clear";
import { KickCommand } from "../commands/moderation/kick";
import { BanCommand } from "../commands/moderation/ban";
import { UnbanCommand } from "../commands/moderation/unban";
import { GiveawayCommand } from "../commands/misc/giveaway";

export class InteractionHandler {
	private commands: Command[];

	constructor() {
		this.commands = [
			new PingCommand(),
			new HelpCommand(),
			new ClearCommand(),
			new KickCommand(),
			new BanCommand(),
			new UnbanCommand(),
			new GiveawayCommand(),
		];
	}

	getSlashCommands() {
		return this.commands.map((command: Command) => command.slashCommandConfig.toJSON());
	}

	async handleInteraction(interaction: Interaction): Promise<void> {
		if (interaction.isCommand()) {
			const commandName = interaction.commandName;
	
			const matchedCommand = this.commands.find((command) => command.name === commandName);
	
			if (!matchedCommand) {
				return Promise.reject("Command not matched.");
			}
	
			matchedCommand
				.execute(<ChatInputCommandInteraction> interaction)
				.then(() => {
					console.log(`Successfully executed command [/${interaction.commandName}]`);
				})
				.catch((err) => {
					console.log(`Error executing command [/${interaction.commandName}]: ${err}`);
				});
		} else if (interaction.isButton()) {
			// Responding to global buttons.
		} else if (interaction.isStringSelectMenu()) {
			// Responding to global select menus. 
		}
	}
}
