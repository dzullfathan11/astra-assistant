module.exports = {
  name: 'verify',

  async execute(message) {
    const role = message.guild.roles.cache.find(r => r.name === 'Verified');

    if (!role) {
      return message.reply('Role Verified tidak ada.');
    }

    await message.member.roles.add(role);

    message.reply('Verifikasi berhasil.');
  }
};