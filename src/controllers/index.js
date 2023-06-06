const db = require("../database/connection");
const {
  MessageActionRow,
  MessageSelectMenu,
  ChannelType,
} = require("discord.js");

module.exports = {
  async execute(message) {
    const id = message.author.id;
    const channelName = message.channel.name;

    if (message.author.bot) {
      return;
    }

    if (message.content === "test") {
      message.reply("masuk!");
    }

    if (message.channel.type === ChannelType.PublicThread) {
      const categoryName = message.channel.name;
      try {
        await db.query(`BEGIN`);

        const findCategory = `SELECT * FROM categories WHERE user_id = $1 AND category_name =$2`;
        const category = await db.query(findCategory, [id, categoryName]);
        const categoryId = category.rows[0].category_id;
        const isIncome = category.rows[0].is_income;

        const msg = message.content.split(" ");
        const description = msg.slice(1).join(" ");
        let amount = msg[0];
        if (amount.includes(".")) {
          amount = amount.replace(/[._-]/g, "");
        }
        amount = +amount;
        if (isNaN(amount)) {
          message.reply("first input must be number, ex: `12000 bonus`");
          throw new Error("first input must be number ex `12000 bonus`");
        }

        console.log(description, amount);
        let income = 0;
        let expense = 0;
        if (isIncome) {
          income += amount;
        } else {
          expense += amount;
          amount = amount * -1;
        }

        const createTransactions = `INSERT INTO transactions (category_id, description, income, expense) VALUES ($1, $2, $3, $4) RETURNING *`;
        const updateBalance = `UPDATE users SET balance = balance + $1 WHERE user_id = $2 RETURNING *`;

        await db.query(createTransactions, [
          categoryId,
          description,
          income,
          expense,
        ]);
        const balance = await db.query(updateBalance, [amount, id]);
        const currentBalance = balance.rows[0].balance

        await db.query(`COMMIT`);
        message.reply( `transaction success, your current balance is ${currentBalance}`);
      } catch (error) {
        console.error("Error reading data:", error);
      }
    }

    if (channelName === "income" || channelName === "expense") {
      try {
        const channel = message.channel;
        const categoryName = message.content;
        let isIncome = true;
        if (channelName === "expense") {
          isIncome = false;
        }

        const existThread = channel.threads.cache.find(
          (x) => x.name === categoryName,
        );

        const thread = await message.startThread({
          name: categoryName,
          autoArchiveDuration: 60,
          type: "GUILD_PUBLIC_THREAD",
        });

        if (existThread) {
          thread.delete();
          message.reply("category is already exist");
          return;
        }

        const createCategory = `INSERT INTO categories (user_id, category_name, is_income) VALUES ($1, $2, $3) RETURNING user_id`;
        const result = await db.query(createCategory, [
          id,
          categoryName,
          isIncome,
        ]);
        console.log(result);
      } catch (error) {
        console.error("Error reading data:", error);
      }
    }
  },
};
