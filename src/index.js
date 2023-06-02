require("dotenv").config();
require("./database/connection");
const controllers = require("./controllers/index")
const migrate = require("./database/migration")
const register = require("./command/register")
const { Client, IntentsBitField } = require("discord.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`✅ ${c.user.username} is online`);
});

client.on("messageCreate", (message) => controllers.execute(message));
client.on("interactionCreate", (interaction) => migrate.up(interaction));
client.on("interactionCreate", (interaction) => migrate.down(interaction));
client.on("interactionCreate", (interaction) => register.user(interaction));

client.login(process.env.TOKEN);
