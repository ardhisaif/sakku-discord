const db = require("../database/connection");
const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  async user(interaction, client) {
    const id = interaction.user.id;
    const name = interaction.user.username;
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "register") {
      try {
        const findUser = "SELECT * FROM users WHERE user_id = $1";
        const createUser = "INSERT INTO users (user_id, user_name) VALUES ($1, $2)";
        const users = await db.query(findUser, [id]);
        if (users.rows.length === 0) {
          await db.query(createUser, [id, name]);
          const guild = interaction.guild;

          // Create a private text channel
          await guild.channels.create({
            name: 'income',
            type: ChannelType.GuildText,
            permissionOverwrites: [
              {
                id: guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: client.user.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
            ],
          });

          await guild.channels.create({
            name: 'expense',
            type: ChannelType.GuildText,
            permissionOverwrites: [
              {
                id: guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: client.user.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
            ],
          });

          interaction.reply("register success!");
        } else {
          interaction.reply("user already registered");
        }
      } catch (error) {
        console.error("Error reading data:", error);
      }
    }
  },
};
