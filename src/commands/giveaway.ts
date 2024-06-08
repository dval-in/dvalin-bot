import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/command";
import { MessageReaction, User } from "discord.js";

export class GiveawayCommand implements Command {
	name = "giveaway";
	description = "Creates a giveaway.";
	slashCommandConfig = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)
		.addChannelOption((option) =>
			option.setName("channel").setDescription("The channel to echo into").setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("duration").setDescription("The duration of the giveaway. DD:MM:YY-HH:mm format").setRequired(true)
		)
		.addNumberOption((option) =>
			option.setName("number_of_winners").setDescription("The number of winners for the giveaway.")
		);

	async execute(interaction: any): Promise<void> {
		const duration = interaction.options.getString("duration");
		const channel = interaction.options.getChannel("channel");
		const nWinners = interaction.options.getNumber("number_of_winners") ?? 1;

		// Calculate the duration in milliseconds
		const [datePart, timePart] = duration.split("-");
		const [days, months, years] = datePart.split(":").map(Number);
		const [hours, minutes] = timePart.split(":").map(Number);
		const endDate = new Date();
		endDate.setFullYear(endDate.getFullYear() + years);
		endDate.setMonth(endDate.getMonth() + months);
		endDate.setDate(endDate.getDate() + days);
		endDate.setHours(endDate.getHours() + hours);
		endDate.setMinutes(endDate.getMinutes() + minutes);

		const timeDiff = endDate.getTime() - new Date().getTime();

		const giveawayMessage = await channel.send("React with 🎉 to join the giveaway!");

		const filter = (reaction: MessageReaction, user: User) => reaction.emoji.name === "🎉" && !user.bot;
		const collector = giveawayMessage.createReactionCollector({ filter, time: timeDiff });

		const participants: Set<string> = new Set();

		collector.on("collect", (reaction: any, user: any) => {
			participants.add(user.id);
		});

		collector.on("end", async () => {
			if (participants.size === 0) {
				channel.send("No one participated in the giveaway.");
				return;
			}

			const winners = [];
			const participantArray = Array.from(participants);
			for (let i = 0; i < nWinners && participantArray.length > 0; i++) {
				const winnerIndex = Math.floor(Math.random() * participantArray.length);
				const winnerId = participantArray.splice(winnerIndex, 1)[0];
				winners.push(`<@${winnerId}>`);
			}

			channel.send(`Congratulations to the winners: ${winners.join(", ")}!`);
		});

		await interaction
			.reply({ content: "Giveaway started!", ephemeral: true })
			.then((sentMessage: any) => {
				setTimeout(() => {
					sentMessage.delete().catch(console.error);
				}, 5000);
			})
			.catch(console.error);
	}
}
