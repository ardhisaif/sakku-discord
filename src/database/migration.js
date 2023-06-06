const db = require("./connection");

module.exports = {
  async up(interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "migrate_up") {
      const createUserTable = `CREATE TABLE IF NOT EXISTS users (
            user_id VARCHAR(100),
            user_name VARCHAR(100) NOT NULL,
            balance NUMERIC(10, 2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id)
          );
          `;

      const createCategoryTable = `CREATE TABLE IF NOT EXISTS categories(
         category_id VARCHAR(100) NOT NULL DEFAULT uuid_generate_v1(),
        user_id VARCHAR(100),
        category_name VARCHAR(100),
        is_income BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (category_id),
        CONSTRAINT fk_user
            FOREIGN KEY(user_id) 
              REFERENCES users(user_id)
      )`;

      const createTransactionTable = `CREATE TABLE IF NOT EXISTS transactions(
          transaction_id VARCHAR(100) NOT NULL DEFAULT uuid_generate_v1(),
          category_id VARCHAR(100),
          description VARCHAR(100),
          income NUMERIC(10, 2) DEFAULT 0.00,
          expense NUMERIC(10, 2) DEFAULT 0.00,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (transaction_id),
          CONSTRAINT fk_category
            FOREIGN KEY(category_id) 
              REFERENCES categories(category_id)
        )`;
      try {
        await db.query(createUserTable);
        await db.query(createCategoryTable);
        await db.query(createTransactionTable);
        interaction.reply("migrate up success");
      } catch (error) {
        console.error("Error reading data:", error);
      }
    }
  },

  async down(interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "migrate_down") {
      const deleteTransactionTable = `DROP TABLE transactions`;
      const deleteCategoryTable = `DROP TABLE categories`;
      const deleteUserTable = `DROP TABLE users`;

      try {
        await db.query(deleteTransactionTable);
        await db.query(deleteCategoryTable);
        await db.query(deleteUserTable);
        interaction.reply("migrate down success");
      } catch (error) {
        console.error("Error reading data:", error);
      }
    }
  },
};
