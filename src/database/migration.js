const db = require("./connection");

module.exports = {
  async up(interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "migrate_up") {
      const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
            user_id VARCHAR(100) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            balance NUMERIC(10, 2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          `;
      const createTransactionsTable = `CREATE TABLE IF NOT EXISTS transactions(
          transaction_id VARCHAR(100) NOT NULL DEFAULT uuid_generate_v1(),
          user_id varchar(100),
          description VARCHAR(100),
          income numeric(10, 2) DEFAULT 0.00,
          expense numeric(10, 2) DEFAULT 0.00,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (transaction_id),
          CONSTRAINT fk_user
            FOREIGN KEY(user_id) 
              REFERENCES users(user_id)
        )`;
      try {
        await db.query(createUsersTable);
        await db.query(createTransactionsTable);
        interaction.reply("migrate up success");
      } catch (error) {
        console.error("Error reading data:", error);
      }
    }
  },

  async down(interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "migrate_down") {
      const deleteTable = `DROP TABLE users`;

      try {
        const migrate = await db.query(deleteTable);
        interaction.reply("migrate down success");
      } catch (error) {
        console.error("Error reading data:", error);
      }
    }
  },
};
