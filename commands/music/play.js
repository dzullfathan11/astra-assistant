const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');

const play = require('play-dl');

module.exports = {
  name: 'play',

  async execute(message, args) {
    const url = args[0];

    if (!url) {
      return message.reply('Masukkan URL YouTube.');
    }

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('Masuk voice channel dulu.');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    const stream = await play.stream(url);

    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    });

    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      message.channel.send('Memutar musik.');
    });
  }
};