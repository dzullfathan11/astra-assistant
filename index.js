require('dotenv').config();
                }
              ]
            }
          ]
        }
      );

      const text =
        response.data.candidates[0]
          .content.parts[0].text;

      return message.reply(text);

    } catch (err) {

      console.log(err);

      return message.reply(
        '❌ Gemini API Error.'
      );

    }

  }

  // NOTIFY
  if (command === 'notify') {

    return message.reply(
      '🔔 Notification system active.'
    );

  }

  // TICKET
  if (command === 'ticket') {

    const channel =
      await message.guild.channels.create({
        name:
          `ticket-${message.author.username}`,
        type: 0
      });

    return message.reply(
      `🎫 Ticket created: ${channel}`
    );

  }

});

client.on('interactionCreate', async interaction => {

  if (!interaction.isButton()) return;

  if (interaction.customId === 'pause') {

    player.pause();

    return interaction.reply({
      content: '⏸️ Music paused.',
      ephemeral: true
    });

  }

  if (interaction.customId === 'skip') {

    player.stop();

    return interaction.reply({
      content: '⏭️ Music skipped.',
      ephemeral: true
    });

  }

});

client.login(process.env.TOKEN);
