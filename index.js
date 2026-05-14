require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');

const play = require('play-dl');



const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});



// =====================
// CONFIG
// =====================

const guildConfig = {};

const ACCESS_ROLE =
  'Astra Manager';



// =====================
// MUSIC SYSTEM
// =====================

const player = createAudioPlayer();

let currentConnection = null;



// =====================
// READY
// =====================

client.once('ready', () => {

  console.log(
    `${client.user.tag} online!`
  );

});



// =====================
// WELCOME
// =====================

client.on('guildMemberAdd', member => {

  const config =
    guildConfig[member.guild.id];

  if (!config?.welcomeChannel)
    return;

  const channel =
    member.guild.channels.cache.get(
      config.welcomeChannel
    );

  if (!channel) return;

  channel.send(
    `👋 Welcome ${member}`
  );

});



// =====================
// LEAVE
// =====================

client.on('guildMemberRemove', member => {

  const config =
    guildConfig[member.guild.id];

  if (!config?.leaveChannel)
    return;

  const channel =
    member.guild.channels.cache.get(
      config.leaveChannel
    );

  if (!channel) return;

  channel.send(
    `😢 ${member.user.tag} left server`
  );

});



// =====================
// COMMANDS
// =====================

client.on('messageCreate', async message => {

  if (message.author.bot) return;

  const prefix = '!';

  if (
    !message.content.startsWith(prefix)
  )
    return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const command =
    args.shift().toLowerCase();



// =====================
// ADMIN PANEL
// =====================

  if (command === 'panel') {

    const role =
      message.guild.roles.cache.find(
        r => r.name === ACCESS_ROLE
      );

    if (
      !message.member.roles.cache.has(
        role?.id
      )
    ) {

      return message.reply(
        '❌ No access.'
      );

    }



    const embed = new EmbedBuilder()

      .setColor('#5865F2')

      .setTitle(
        '⚙️ Astra Admin Panel'
      )

      .setDescription(
        'Setup all systems here.'
      );



    // ADMIN BUTTONS

    const adminRow =
      new ActionRowBuilder()

        .addComponents(

          new ButtonBuilder()
            .setCustomId(
              'setup_social'
            )
            .setLabel(
              'Social Channel'
            )
            .setStyle(
              ButtonStyle.Primary
            ),

          new ButtonBuilder()
            .setCustomId(
              'setup_stock'
            )
            .setLabel(
              'Stock Channel'
            )
            .setStyle(
              ButtonStyle.Success
            ),

          new ButtonBuilder()
            .setCustomId(
              'setup_music'
            )
            .setLabel(
              'Music Channel'
            )
            .setStyle(
              ButtonStyle.Secondary
            ),

          new ButtonBuilder()
            .setCustomId(
              'setup_role'
            )
            .setLabel(
              'Take Role Channel'
            )
            .setStyle(
              ButtonStyle.Danger
            )

        );



    const adminRow2 =
      new ActionRowBuilder()

        .addComponents(

          new ButtonBuilder()
            .setCustomId('kick')
            .setLabel('Kick')
            .setStyle(
              ButtonStyle.Danger
            ),

          new ButtonBuilder()
            .setCustomId('ban')
            .setLabel('Ban')
            .setStyle(
              ButtonStyle.Danger
            ),

          new ButtonBuilder()
            .setCustomId('addrole')
            .setLabel('Add Role')
            .setStyle(
              ButtonStyle.Success
            )

        );



    // MUSIC PANEL

    const musicRow =
      new ActionRowBuilder()

        .addComponents(

          new ButtonBuilder()
            .setCustomId('play')
            .setLabel('Play')
            .setStyle(
              ButtonStyle.Success
            ),

          new ButtonBuilder()
            .setCustomId('pause')
            .setLabel('Pause')
            .setStyle(
              ButtonStyle.Secondary
            ),

          new ButtonBuilder()
            .setCustomId('skip')
            .setLabel('Next')
            .setStyle(
              ButtonStyle.Primary
            )

        );



    return message.channel.send({

      embeds: [embed],

      components: [
        adminRow,
        adminRow2,
        musicRow
      ]

    });

  }



// =====================
// PLAY MUSIC
// =====================

  if (command === 'play') {

    const config =
      guildConfig[message.guild.id];



    if (
      config?.musicChannel &&
      message.channel.id !==
        config.musicChannel
    ) {

      return message.reply(
        '❌ Wrong music channel.'
      );

    }



    const url = args[0];

    if (!url) {

      return message.reply(
        'Masukkan URL YouTube / Spotify.'
      );

    }



    const voiceChannel =
      message.member.voice.channel;

    if (!voiceChannel) {

      return message.reply(
        'Join VC dulu.'
      );

    }



    currentConnection =
      joinVoiceChannel({

        channelId: voiceChannel.id,

        guildId: message.guild.id,

        adapterCreator:
          message.guild
            .voiceAdapterCreator

      });



    const stream =
      await play.stream(url);



    const resource =
      createAudioResource(
        stream.stream,
        {
          inputType:
            stream.type
        }
      );



    player.play(resource);

    currentConnection.subscribe(
      player
    );



    return message.reply(
      '🎵 Playing music.'
    );

  }



// =====================
// TICKET
// =====================

  if (command === 'ticket') {

    const channel =
      await message.guild.channels.create({

        name:
          `ticket-${message.author.username}`,

        type:
          ChannelType.GuildText

      });



    return message.reply(
      `🎫 Ticket created: ${channel}`
    );

  }

});



// =====================
// BUTTONS
// =====================

client.on(
  'interactionCreate',
  async interaction => {



// =====================
// BUTTON INTERACTION
// =====================

    if (interaction.isButton()) {



// MUSIC BUTTONS
// EVERYONE CAN USE

      if (
        interaction.customId ===
        'pause'
      ) {

        player.pause();

        return interaction.reply({

          content:
            '⏸️ Music paused.',

          ephemeral: true

        });

      }



      if (
        interaction.customId ===
        'skip'
      ) {

        player.stop();

        return interaction.reply({

          content:
            '⏭️ Music skipped.',

          ephemeral: true

        });

      }



// ADMIN ACCESS

      const role =
        interaction.guild.roles.cache.find(
          r =>
            r.name === ACCESS_ROLE
        );



      if (
        !interaction.member.roles.cache.has(
          role?.id
        )
      ) {

        return interaction.reply({

          content:
            '❌ No access.',

          ephemeral: true

        });

      }



// CHANNEL SETUP

      if (
        interaction.customId.startsWith(
          'setup_'
        )
      ) {

        const channels =
          interaction.guild.channels.cache

            .filter(
              c =>
                c.type ===
                ChannelType.GuildText
            )

            .map(channel => ({
              label:
                channel.name,

              value:
                channel.id
            }))

            .slice(0, 25);



        const menu =
          new StringSelectMenuBuilder()

            .setCustomId(
              interaction.customId
            )

            .setPlaceholder(
              'Select channel'
            )

            .addOptions(channels);



        const row =
          new ActionRowBuilder()

            .addComponents(menu);



        return interaction.reply({

          content:
            '📌 Select channel.',

          components: [row],

          ephemeral: true

        });

      }



// KICK

      if (
        interaction.customId ===
        'kick'
      ) {

        return interaction.reply({

          content:
            '👢 Use command: !kick @user',

          ephemeral: true

        });

      }



// BAN

      if (
        interaction.customId ===
        'ban'
      ) {

        return interaction.reply({

          content:
            '🔨 Use command: !ban @user',

          ephemeral: true

        });

      }



// ADD ROLE

      if (
        interaction.customId ===
        'addrole'
      ) {

        return interaction.reply({

          content:
            '➕ Use command: !addrole @user role',

          ephemeral: true

        });

      }

    }



// =====================
// SELECT MENU
// =====================

    if (
      interaction.isStringSelectMenu()
    ) {

      const channelId =
        interaction.values[0];



      if (
        !guildConfig[
          interaction.guild.id
        ]
      ) {

        guildConfig[
          interaction.guild.id
        ] = {};

      }



// SOCIAL

      if (
        interaction.customId ===
        'setup_social'
      ) {

        guildConfig[
          interaction.guild.id
        ].socialChannel =
          channelId;

      }



// STOCK

      if (
        interaction.customId ===
        'setup_stock'
      ) {

        guildConfig[
          interaction.guild.id
        ].stockChannel =
          channelId;

      }



// MUSIC

      if (
        interaction.customId ===
        'setup_music'
      ) {

        guildConfig[
          interaction.guild.id
        ].musicChannel =
          channelId;

      }



// ROLE

      if (
        interaction.customId ===
        'setup_role'
      ) {

        guildConfig[
          interaction.guild.id
        ].roleChannel =
          channelId;

      }



      return interaction.reply({

        content:
          '✅ Channel configured.',

        ephemeral: true

      });

    }

  }
);



client.login(process.env.TOKEN);