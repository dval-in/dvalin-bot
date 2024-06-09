import {
	Client, 
	Events, 
	GatewayIntentBits, 
	REST as DiscordRestClient,
	Routes,
	ChatInputCommandInteraction
} from "discord.js";
// import { onMessageCreate } from "./events/messageCreate";
import { onReady } from "./events/ready";
import { config } from "./config";
import { InteractionHandler } from './handlers/interactionHandler';

class Bot {

	private client: Client;
	private discordRestClient: DiscordRestClient;
	private interactionHandler: InteractionHandler;

	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
			],
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
				this.addClientEventHandlers();
				this.registerSlashCommands();
			})
			.catch((err) => {
				console.error("Error starting bot", err);
			});
	}

	addClientEventHandlers() {

		this.client.on(Events.ClientReady, () => onReady(this.client));

		this.client.on(Events.Error, (err: Error) => {
			console.error("Client error", err);
		});

		// this.client.on(Events.MessageCreate, message => onMessageCreate(this.client, message));

		this.client.on(Events.InteractionCreate, (interaction) => {
			this.interactionHandler.handleInteraction(
				interaction as ChatInputCommandInteraction
			);
		});
	}

	registerSlashCommands() {
		const commands = this.interactionHandler.getSlashCommands();
		this.discordRestClient
			.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
				body: commands,
			})
			.then((data: any) => {
				console.log(`Successfully registered ${data.length} global application (/) commands.`)
			})
			.catch((err) => {
				console.error("Error registering application (/) commands", err);
			});
	}
}

const app = new Bot();
app.init();