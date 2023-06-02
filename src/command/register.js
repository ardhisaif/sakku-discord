const db = require("../database/connection");

module.exports = {
  async user(interaction) {
    const id = interaction.user.id;
    const name = interaction.user.username;
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "register") {
      try {
        const findUser = "SELECT * FROM users WHERE user_id = $1";
        const createUser = "INSERT INTO users (user_id, name) VALUES ($1, $2)";
        const users = await db.query(findUser, [id]);
        if (users.rows.length === 0) {
          await db.query(createUser, [id, name]);
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
