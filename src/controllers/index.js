const db = require("../database/connection");

module.exports = {
  async execute(message) {
    if (message.author.bot) {
      return;
    }

    if (message.content === "test") {
      message.reply("masuk!");
    }

    if (message.channel.name === "income") {
      try {
        const id = message.author.id
        const msg = message.content.split(" ");
        const description = msg.slice(1).join(" ");
        let income = msg[0];
        if (income.includes(".")) {
          income = income.replace(/[._-]/g, "");
        }
        income = +income;
        console.log(description, +income);

        const createTransactions = `INSERT INTO transactions (user_id, description,income) VALUES ($1, $2, $3) RETURNING user_id`
        const value = [id, description, income]

        const result = await db.query(createTransactions, value)
        console.log(result);
        message.reply("transaction success")

      } catch (error) {
        console.error("Error reading data:", error);
      }
    }
  },
};
