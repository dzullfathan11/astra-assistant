const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Cek ping bot'),

  async execute(interaction) {
    await interaction.reply('Pong!');
  }
};