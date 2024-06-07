import { Client, Events, GatewayIntentBits } from "discord.js";
import { onMessageCreate } from "./events/messageCreate";
import { onReady } from "./events/ready";
import { config } from "./config";

class Bot {

	private client: Client;

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
	}

	init() {
		this.client
			.login(config.DISCORD_TOKEN)
			.then(() => {
				this.addClientEventHandlers();
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

		this.client.on(Events.MessageCreate, message => onMessageCreate(this.client, message));
	}
}

const app = new Bot();
app.init();