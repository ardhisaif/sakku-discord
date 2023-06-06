const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

pool.query("SELECT NOW()", (err, res) => {
  console.log(res.rows[0].now);
});

module.exports = pool;
