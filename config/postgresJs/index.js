require("dotenv").config();

// if(process.env.PostgressqlURI) mongoose.connect(process.env.PostgressqlURI)
// somehow client work, not pool
const { Pool } = require("pg");

const pool = new Pool({
  port: process.env.POSTGRES_PORT, // Postgres server port[s]
  database: process.env.POSTGRES_DB, // Name of database to connect to
  user: process.env.POSTGRES_USER, // Username of database user
  password: process.env.POSTGRES_PASSWORD, // Password of database user
  host: process.env.POSTGRES_LOCAL, // for docker-compose up db, to just run the database
  // host:  process.env.POSTGRES_HOST, // this is for docker-compose up

});

module.exports = {
  pool,
};
