require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  StringSelectMenuBuilder
} = require('discord.js');



const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});



// ======================
// CONFIG
// ======================

const guildConfig = {};



// ROLE YANG BOLEH AKSES PANEL
const ACCESS_ROLE_NAME =
  'Astra Manager';



// ======================
// READY
// ======================

client.once('ready', () => {

  console.log(`${client.user.tag} online!`);

});



// ======================
// WELCOME
// ======================

client.on('guildMemberAdd', member => {

  const config =
    guildConfig[member.guild.id];

  if (!config?.welcomeChannel) return;

  const channel =
    member.guild.channels.cache.get(
      config.welcomeChannel
    );

  if (!channel) return;

  channel.send(
    `👋 Selamat datang ${member}`
  );

});



// ======================
// LEAVE
// ======================

client.on('guildMemberRemove', member => {

  const config =
    guildConfig[member.guild.id];

  if (!config?.leaveChannel) return;

  const channel =
    member.guild.channels.cache.get(
      config.leaveChannel
    );

  if (!channel) return;

  channel.send(
    `😢 ${member.user.tag} keluar dari server`
  );

});



// ======================
// MESSAGE COMMANDS
// ======================

client.on('messageCreate', async message => {

  if (message.author.bot) return;

  const prefix = '!';

  if (!message.content.startsWith(prefix))
    return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const command =
    args.shift().toLowerCase();



// ======================
// PANEL COMMAND
// ======================

  if (command === 'panel') {



// ROLE CHECK

    const role =
      message.guild.roles.cache.find(
        r => r.name === ACCESS_ROLE_NAME
      );



    if (
      !message.member.roles.cache.has(
        role?.id
      )
    ) {

      return message.reply(
        '❌ Tidak punya akses panel.'
      );

    }



    const embed = new EmbedBuilder()

      .setColor('#5865F2')

      .setTitle('⚙️ Astra Assistant Panel')

      .setDescription(
        'Gunakan tombol untuk setup bot.'
      )

      .addFields(
        {
          name: '🎵 Music',
          value:
            'Semua member bisa akses.',
          inline: true
        },
        {
          name: '🛡️ Admin',
          value:
            'Khusus role Astra Manager.',
          inline: true
        }
      );



    const row1 =
      new ActionRowBuilder()

        .addComponents(

          new ButtonBuilder()
            .setCustomId(
              'setup_welcome'
            )
            .setLabel(
              'Setup Welcome'
            )
            .setStyle(
              ButtonStyle.Success
            ),

          new ButtonBuilder()
            .setCustomId(
              'setup_leave'
            )
            .setLabel(
              'Setup Leave'
            )
            .setStyle(
              ButtonStyle.Danger
            ),

          new ButtonBuilder()
            .setCustomId(
              'setup_social'
            )
            .setLabel(
              'Setup Social'
            )
            .setStyle(
              ButtonStyle.Primary
            ),

          new ButtonBuilder()
            .setCustomId(
              'setup_stock'
            )
            .setLabel(
              'Setup Stock'
            )
            .setStyle(
              ButtonStyle.Secondary
            )

        );



    const row2 =
      new ActionRowBuilder()

        .addComponents(

          new ButtonBuilder()
            .setCustomId(
              'setup_adminlog'
            )
            .setLabel(
              'Setup Admin Log'
            )
            .setStyle(
              ButtonStyle.Danger
            ),

          new ButtonBuilder()
            .setCustomId(
              'music_panel'
            )
            .setLabel(
              'Music Panel'
            )
            .setStyle(
              ButtonStyle.Success
            )

        );



    return message.channel.send({

      embeds: [embed],

      components: [row1, row2]

    });

  }

});



// ======================
// INTERACTIONS
// ======================

client.on('interactionCreate', async interaction => {



// ======================
// BUTTONS
// ======================

  if (interaction.isButton()) {



// MUSIC BUTTON
// SEMUA ORANG BISA

    if (
      interaction.customId ===
      'music_panel'
    ) {

      return interaction.reply({

        content:
          '🎵 Gunakan !play <url>',

        ephemeral: true

      });

    }



// ROLE CHECK

    const role =
      interaction.guild.roles.cache.find(
        r => r.name === ACCESS_ROLE_NAME
      );



    if (
      !interaction.member.roles.cache.has(
        role?.id
      )
    ) {

      return interaction.reply({

        content:
          '❌ Tidak punya akses.',

        ephemeral: true

      });

    }



// CHANNEL LIST

    const channels =
      interaction.guild.channels.cache

        .filter(
          c =>
            c.type ===
            ChannelType.GuildText
        )

        .map(channel => ({
          label: channel.name,
          value: channel.id
        }))

        .slice(0, 25);



// SELECT MENU

    const menu =
      new StringSelectMenuBuilder()

        .setCustomId(
          interaction.customId
        )

        .setPlaceholder(
          'Pilih channel'
        )

        .addOptions(channels);



    const row =
      new ActionRowBuilder()
        .addComponents(menu);



    return interaction.reply({

      content:
        '📌 Pilih channel.',

      components: [row],

      ephemeral: true

    });

  }



// ======================
// SELECT MENU
// ======================

  if (interaction.isStringSelectMenu()) {

    const channelId =
      interaction.values[0];



    if (
      !guildConfig[interaction.guild.id]
    ) {

      guildConfig[
        interaction.guild.id
      ] = {};

    }



// WELCOME

    if (
      interaction.customId ===
      'setup_welcome'
    ) {

      guildConfig[
        interaction.guild.id
      ].welcomeChannel = channelId;

    }



// LEAVE

    if (
      interaction.customId ===
      'setup_leave'
    ) {

      guildConfig[
        interaction.guild.id
      ].leaveChannel = channelId;

    }



// SOCIAL

    if (
      interaction.customId ===
      'setup_social'
    ) {

      guildConfig[
        interaction.guild.id
      ].socialChannel = channelId;

    }



// STOCK

    if (
      interaction.customId ===
      'setup_stock'
    ) {

      guildConfig[
        interaction.guild.id
      ].stockChannel = channelId;

    }



// ADMIN LOG

    if (
      interaction.customId ===
      'setup_adminlog'
    ) {

      guildConfig[
        interaction.guild.id
      ].adminLogChannel = channelId;

    }



    return interaction.reply({

      content:
        '✅ Channel berhasil diatur.',

      ephemeral: true

    });

  }

});



client.login(process.env.TOKEN);
