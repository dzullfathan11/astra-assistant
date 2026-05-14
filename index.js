require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection
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

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);

    // Prefix Commands
    if (command.name) {
      client.commands.set(command.name, command);
    }

    // Slash Commands
    if (command.data) {
      client.commands.set(command.data.name, command);
    }
  }
}

client.once('ready', () => {
  console.log(`${client.user.tag} online!`);
});



// PREFIX COMMANDS
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefix = process.env.PREFIX;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('Terjadi error.');
  }
});



// SLASH COMMANDS
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'Terjadi error.',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: 'Terjadi error.',
        ephemeral: true
      });
    }
  }
});



client.login(process.env.TOKEN);
