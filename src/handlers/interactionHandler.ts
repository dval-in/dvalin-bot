import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "../commands";
import { PingCommand } from "../commands/misc/ping"

export class InteractionHandler {
    private commands: Command[];

    constructor() {
        this.commands = [
            new PingCommand(),
        ];
    }

    getSlashCommands() {
        return this.commands.map((command: Command) => {
            command.slashCommandConfig.toJSON()
        });
    }

    async handleInteraction(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        const commandName = interaction.commandName;

        const matchedCommand = this.commands.find(
            (command) => command.name === commandName
        );

        if (!matchedCommand) {
            return Promise.reject("Command not matched.");
        }

        matchedCommand
            .execute(interaction)
            .then(() => {
                console.log(`Successfully executed command [/${interaction.commandName}]`);
        })
        .catch((err) => {
            console.log(`Error executing command [/${interaction.commandName}]: ${err}`);
        });
    };
}