const {
  EmbedBuilder
} = require('discord.js');

module.exports = {

  name: 'help',

  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('✨ Astra Assistant')
      .setDescription(
        'Daftar command Astra Assistant'
      )
      .addFields(
        {
          name: '🎵 Music',
          value:
            '`!play`\n`!skip`\n`!stop`',
          inline: true
        },
        {
          name: '🤖 AI',
          value:
            '`!ai`',
          inline: true
        },
        {
          name: '💰 Economy',
          value:
            '`!balance`\n`!daily`',
          inline: true
        },
        {
          name: '🛡️ Moderation',
          value:
            '`!ban`\n`!kick`\n`!clear`',
          inline: true
        },
        {
          name: '🎫 Ticket',
          value:
            '`!ticket`',
          inline: true
        },
        {
          name: '✅ Verify',
          value:
            '`!verify`',
          inline: true
        }
      )
      .setFooter({
        text: 'Astra Assistant'
      });

    message.channel.send({
      embeds: [embed]
    });

  }

};
