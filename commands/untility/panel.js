const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {

  name: 'panel',

  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('✨ Astra Assistant Control Panel')
      .setDescription(
        'Gunakan tombol di bawah untuk menjalankan fitur bot.'
      )
      .addFields(
        {
          name: '🤖 AI',
          value: '`!ai pertanyaan`',
          inline: true
        },
        {
          name: '💰 Economy',
          value: '`!balance`',
          inline: true
        }
      );



    // ROW 1
    const row1 = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('music')
          .setLabel('Music')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('ticket')
          .setLabel('Ticket')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('verify')
          .setLabel('Verify')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('server')
          .setLabel('SA:MP')
          .setStyle(ButtonStyle.Danger)

      );



    // ROW 2
    const row2 = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('social')
          .setLabel('Social Media')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('stock')
          .setLabel('Stock Alert')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('admin')
          .setLabel('Admin Access')
          .setStyle(ButtonStyle.Danger)

      );



    await message.channel.send({
      embeds: [embed],
      components: [row1, row2]
    });

  }

};
