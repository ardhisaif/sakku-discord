require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const fs = require('fs')
const db = require("./database/connection");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const sadWords = ["sad", "depressed", "unhappy", "angry", "miserable"];
const encouragements = [
  "Cheer up!",
  "Hang in there.",
  "You are a great person!",
];
const getQuote = async () => {
  const res = await fetch("https://zenquotes.io/api/random");
  const data = await res.json();
  return data[0]["q"] + " -" + data[0]["a"];
};

db.connect()
  .then(() => {
    console.log("database connected");
    client.on("ready", (c) => {
      console.log(`✅ ${c.user.username} is online`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

const focusRoomUser = {};

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    if (file === "interactionCreate.js" || file === "voiceStateUpdate.js") {
      client.on(event.name, (...args) => event.execute(...args, focusRoomUser));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content === "!!test") {
    message.reply("masuk!");
  }

  if (message.content === "$inspire") {
    getQuote().then((quote) => message.channel.send(quote));
  }

  if (sadWords.some((word) => message.content.includes(word))) {
    const encouragement =
      encouragements[Math.floor(Math.random() * encouragements.length)];
    message.reply(encouragement);
  }
});

// client.on("interactionCreate", (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === "hey") {
//     interaction.reply("hey!");
//   }

//   if (interaction.commandName === "ping") {
//     interaction.reply("pong!!");
//   }
// });

client.login(process.env.TOKEN);
