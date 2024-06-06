import { Message, TextChannel } from "discord.js";

export let giveawayActive = false;
let participants: string[] = [];
let numberOfWinners = 1;
let giveawayTimeout: NodeJS.Timeout | null = null;

export function startGiveaway(message: Message, args: string[]): void {
	const duration = parseInt(args[0]);
	numberOfWinners = parseInt(args[1]) || 1;

	if (isNaN(duration) || isNaN(numberOfWinners)) {
		message.channel.send("Please provide valid duration in seconds and number of winners.");
		return;
	}

	participants = [];
	giveawayActive = true;
	message.channel.send(`Giveaway started! You have ${duration} seconds to enter. Type !enter to participate.`);

	if (giveawayTimeout) clearTimeout(giveawayTimeout);

	giveawayTimeout = setTimeout(() => {
		endGiveaway(message.channel as TextChannel);
	}, duration * 1000);
}

export function enterGiveaway(message: Message): void {
	const userId = message.author.id;
	if (participants.includes(userId)) {
		message.channel.send("You have already entered the giveaway.");
		return;
	}
	participants.push(userId);
	message.channel.send("You have successfully entered the giveaway!");
}

function endGiveaway(channel: TextChannel): void {
	giveawayActive = false;
	if (participants.length === 0) {
		channel.send("No participants entered the giveaway.");
		return;
	}

	const winners = [];
	for (let i = 0; i < numberOfWinners; i++) {
		if (participants.length === 0) break;
		const winnerIndex = Math.floor(Math.random() * participants.length);
		winners.push(participants.splice(winnerIndex, 1)[0]);
	}

	const winnerMentions = winners.map((id) => `<@${id}>`).join(", ");
	channel.send(`Giveaway ended! Congratulations to the winners: ${winnerMentions}`);
}
