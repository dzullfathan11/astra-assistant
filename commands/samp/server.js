const axios = require('axios');

module.exports = {
  name: 'server',

  async execute(message) {
    try {
      const response = await axios.get(
        'https://api.mcsrvstat.us/2/play.example.com'
      );

      message.channel.send(
        `Server online: ${response.data.online}`
      );
    } catch {
      message.reply('Server tidak ditemukan.');
    }
  }
};