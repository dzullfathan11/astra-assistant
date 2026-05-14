const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Gemini AI Chat',

  async execute(message, args) {
    const prompt = args.join(' ');

    if (!prompt) {
      return message.reply('Masukkan pertanyaan.');
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }
      );

      const text = response.data.candidates[0].content.parts[0].text;

      message.reply(text);
    } catch (err) {
      console.error(err);
      message.reply('AI error.');
    }
  }
};