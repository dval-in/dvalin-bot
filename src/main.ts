import { Client, GatewayIntentBits, REST as DiscordRestClient, Routes } from "discord.js";
import { config } from "./config";
import { InteractionHandler } from "./handlers/interactionHandler";

class Bot {
	private client: Client;
	private discordRestClient: DiscordRestClient;
	private interactionHandler: InteractionHandler;

	constructor() {
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
			shards: "auto",
			failIfNotExists: false,
		});
		this.discordRestClient = new DiscordRestClient().setToken(config.DISCORD_TOKEN);
		this.interactionHandler = new InteractionHandler();
	}

	init() {
		this.client
			.login(config.DISCORD_TOKEN)
			.then(() => {
				this.registerSlashCommands();
			})
			.catch((err) => {
				console.error("Error starting bot", err);
			});
	}

	registerSlashCommands() {
		const commands = this.interactionHandler.getSlashCommands();
		this.discordRestClient
			.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
				body: commands,
			})
			.then((data: any) => {
				console.log(`Successfully registered ${data.length} global application (/) commands.`);
			})
			.catch((err) => {
				console.error("Error registering application (/) commands", err);
			});
	}
}

const app = new Bot();
app.init();
