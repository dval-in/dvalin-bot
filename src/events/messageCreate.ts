import { Client, Message } from "discord.js";
import { PREFIX } from "../config";
// import { startGiveaway, enterGiveaway, giveawayActive } from "../commands/giveaway";

// export function onMessageCreate(client: Client, message: Message): void {
// 	if (message.author.bot) return;

// 	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
// 	const command = args.shift()?.toLowerCase();

// 	if (!command) return;

// 	if (command === "start-giveaway" && message.member?.permissions.has("Administrator")) {
// 		startGiveaway(message, args);
// 	} else if (command === "enter" && giveawayActive) {
// 		enterGiveaway(message);
// 	}
// }
