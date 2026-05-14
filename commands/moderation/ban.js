module.exports = {
  name: 'ban',
  description: 'Ban member',

  async execute(message, args) {
    if (!message.member.permissions.has('BanMembers')) {
      return message.reply('Tidak punya izin.');
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply('Mention member.');
    }

    await member.ban();

    message.channel.send(`${member.user.tag} berhasil diban.`);
  }
};