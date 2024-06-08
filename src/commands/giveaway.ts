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
			option.setName("duration").setDescription("The duration of the giveaway.").setRequired(true)
	)
		.addNumberOption((option) =>
			option.setName("number_of_winners").setDescription("The number of winners for the giveaway.")
		);

	async execute(interaction: any): Promise<void> {
		const duration = interaction.options.getString("duration");
		const channel = interaction.options.getChannel("channel");
		const nWinners = interaction.options.getNumber("number_of_winners") ?? 1;

		// Calculate the duration in milliseconds
		function epochTime(input: string): number | null {
			
			const timeRegex = /^(\d+)\s*days?\s*(\d+)\s*hours?\s*(\d+)\s*minutes?\s*(\d+)(?:\s*seconds?)?$/i;
			
			const match = input.match(timeRegex);

			if (!match) {
				console.error("Invalid input format. Please provide a valid time.");
				return null;
			};

			const days = parseInt(match[1], 10);
			const hours = parseInt(match[2], 10);
			const minutes = parseInt(match[3], 10);
			const seconds = parseInt(match[4], 10);
			const milliseconds = ((((days * 24) + hours * 60) + minutes * 60) + seconds * 1000); // Convert duration to seconds
		
			function calculateEpochTime(milliseconds: number): number {
				const epochTime = Date.now() + milliseconds;
				return epochTime;
			}
		}	

		const giveawayConfirm = await channel.send(`Giveaway Started! Lasting until ${interaction.endDate}\n with ${nWinners}.`)
		const giveawayMessage = await channel.send("React with 🎉 to join the giveaway!");

		const filter = (reaction: MessageReaction, user: User) => reaction.emoji.name === "🎉" && !user.bot;
		const collector = giveawayMessage.createReactionCollector({ filter, time: epochTime });

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
