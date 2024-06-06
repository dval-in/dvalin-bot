import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { onMessageCreate } from "./events/messageCreate";
import { onReady } from "./events/ready";

dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.on("ready", () => onReady(client));
client.on("messageCreate", (message) => onMessageCreate(client, message));

client.login(process.env.TOKEN);
