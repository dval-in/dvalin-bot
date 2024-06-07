const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('Creates a giveaway alert.'),

	async execute(interaction) {
		await interaction.reply('Creating a giveaway...');
	},
};