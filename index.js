require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require('discord.js');

const fs = require('fs');



const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});



client.commands = new Collection();



// ======================
// LOAD COMMANDS
// ======================

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {

  const folderPath = `./commands/${folder}`;

  if (!fs.lstatSync(folderPath).isDirectory()) continue;

  const commandFiles = fs
    .readdirSync(folderPath)
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {

    const command = require(`${folderPath}/${file}`);

    if (command.name) {
      client.commands.set(command.name, command);
    }

    if (command.data) {
      client.commands.set(command.data.name, command);
    }

  }

}



// ======================
// READY
// ======================

client.once('ready', () => {

  console.log(`${client.user.tag} online!`);

});



// ======================
// WELCOME SYSTEM
// ======================

client.on('guildMemberAdd', member => {

  const channel =
    member.guild.channels.cache.find(
      c => c.name === 'welcome'
    );

  if (!channel) return;

  channel.send(
    `👋 Selamat datang ${member}`
  );

});



client.on('guildMemberRemove', member => {

  const channel =
    member.guild.channels.cache.find(
      c => c.name === 'welcome'
    );

  if (!channel) return;

  channel.send(
    `😢 ${member.user.tag} keluar dari server`
  );

});



// ======================
// PREFIX COMMANDS
// ======================

client.on('messageCreate', async message => {

  if (message.author.bot) return;

  const prefix = process.env.PREFIX || '!';

  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const commandName =
    args.shift().toLowerCase();



// ======================
// PANEL COMMAND
// ======================

  if (commandName === 'panel') {

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('✨ Astra Assistant Panel')
      .setDescription(
        'Gunakan tombol di bawah.'
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



    return message.channel.send({
      embeds: [embed],
      components: [row1, row2]
    });

  }



// ======================
// NORMAL COMMANDS
// ======================

  const command =
    client.commands.get(commandName);

  if (!command) return;

  try {

    await command.execute(
      message,
      args,
      client
    );

  } catch (error) {

    console.error(error);

    message.reply(
      '❌ Terjadi error command.'
    );

  }

});



// ======================
// BUTTON SYSTEM
// ======================

client.on('interactionCreate', async interaction => {



// ======================
// SLASH COMMANDS
// ======================

  if (interaction.isChatInputCommand()) {

    const command =
      client.commands.get(
        interaction.commandName
      );

    if (!command) return;

    try {

      await command.execute(interaction);

    } catch (error) {

      console.error(error);

      if (
        interaction.replied ||
        interaction.deferred
      ) {

        await interaction.followUp({
          content: '❌ Error.',
          ephemeral: true
        });

      } else {

        await interaction.reply({
          content: '❌ Error.',
          ephemeral: true
        });

      }

    }

  }



// ======================
// BUTTON INTERACTIONS
// ======================

  if (!interaction.isButton()) return;



// MUSIC
  if (interaction.customId === 'music') {

    return interaction.reply({
      content:
        '🎵 Gunakan !play <url>',
      ephemeral: true
    });

  }



// TICKET
  if (interaction.customId === 'ticket') {

    const channel =
      await interaction.guild.channels.create({
        name:
          `ticket-${interaction.user.username}`,
        type: 0
      });

    return interaction.reply({
      content:
        `🎫 Ticket dibuat: ${channel}`,
      ephemeral: true
    });

  }



// VERIFY
  if (interaction.customId === 'verify') {

    const role =
      interaction.guild.roles.cache.find(
        r => r.name === 'Verified'
      );

    if (role) {

      await interaction.member.roles.add(role);

    }

    return interaction.reply({
      content:
        '✅ Verifikasi berhasil.',
      ephemeral: true
    });

  }



// SA:MP
  if (interaction.customId === 'server') {

    return interaction.reply({
      content:
        '🎮 SA:MP Server Online',
      ephemeral: true
    });

  }



// SOCIAL MEDIA
  if (interaction.customId === 'social') {

    return interaction.reply({
      content:
        '📢 Notifikasi sosial media aktif.',
      ephemeral: true
    });

  }



// STOCK
  if (interaction.customId === 'stock') {

    return interaction.reply({
      content:
        '📈 Notifikasi saham aktif.',
      ephemeral: true
    });

  }



// ADMIN PANEL
  if (interaction.customId === 'admin') {

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {

      return interaction.reply({
        content:
          '❌ Khusus admin.',
        ephemeral: true
      });

    }

    return interaction.reply({
      content:
        '🛡️ Admin access granted.',
      ephemeral: true
    });

  }

});



client.login(process.env.TOKEN);
