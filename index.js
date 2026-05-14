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

// Memastikan folder 'commands' utama ada sebelum dibaca
if (fs.existsSync('./commands')) {
  const commandFolders = fs.readdirSync('./commands');

  for (const folder of commandFolders) {
    const folderPath = `./commands/${folder}`;
    
    // Validasi: Hanya memproses jika item tersebut adalah sebuah folder/direktori
    if (fs.statSync(folderPath).isDirectory()) {
      try {
        const commandFiles = fs
          .readdirSync(folderPath)
          .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
          // Mengamankan proses require agar tidak membuat bot crash jika file bermasalah
          try {
            const command = require(`./commands/${deploy-commands.js}`);

            // Prefix Commands
            if (command.name) {
              client.commands.set(command.name, command);
            }

            // Slash Commands
            if (command.data && command.data.name) {
              client.commands.set(command.data.name, command);
            }
          } catch (error) {
            console.error(`Gagal memuat file script: ${file} di folder ${folder}. Error:`, error.message);
          }
        }
      } catch (dirError) {
        console.error(`Tidak dapat membaca isi folder: ${folderPath}. Error:`, dirError.message);
      }
    }
  }
} else {
  console.error("Error: Folder './commands' tidak ditemukan di root direktori!");
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
    message.reply('Terjadi error saat menjalankan command prefix.');
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
        content: 'Terjadi error saat menjalankan slash command.',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: 'Terjadi error saat menjalankan slash command.',
        ephemeral: true
      });
    }
  }
});



client.login(process.env.TOKEN);
