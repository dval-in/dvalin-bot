import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { onMessageCreate } from "./events/messageCreate";
import { onReady } from "./events/ready";

dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.on(Events.ClientReady, () => onReady(client));
client.on(Events.MessageCreate, (message) => onMessageCreate(client, message));

client.login(process.env.TOKEN);
