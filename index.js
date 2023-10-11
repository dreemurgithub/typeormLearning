require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors({}));
app.use(express.json());

const { createTableConnect } = require("./models/typeorm/index");

const authMiddleware = require("./controller/authMiddleware");
const authRoute = require("./controller/auth/index");
const { pool } = require("./models/postgresJs/index");
const commentRoute = require("./controller/comment/index");
const todoRoute = require("./controller/todo/index");
const usertRoute = require("./controller/user/index");

const expressSession = require("express-session");

app.use(
  expressSession({
    store: new (require("connect-pg-simple")(expressSession))({
      pool: pool, // Connection pool
      tableName: "user_sessions", // Use another table-name than the default "session" one
    }),
    secret: "somesecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.ENVIROMENT === "DEV" ? "auto" : true,
      sameSite: process.env.ENVIROMENT === "DEV" ? "lax" : "none",
    }, // 30 days
    // for browser security requirement on https
  })
);
// testing squash 1
// testing squash 2
app.use(authMiddleware);
app.use(authRoute);
app.use(commentRoute);
app.use(todoRoute);
app.use(usertRoute);
app.listen(process.env.Port, async () => {
  const client = await pool.connect();

  // users_session exists?
  const querySession = `SELECT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = 'user_sessions'
        );`;

  const sessionExist = await pool.query(querySession);

  if (!sessionExist.rows[0].exists) {
    const createSessionTable = `CREATE TABLE user_sessions (sid varchar NOT NULL COLLATE "default",
     sess json NOT NULL, expire timestamp(6) NOT NULL );`;
    const addCCONSTRAINT = `ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_sid_unique UNIQUE (sid);`;
    //  error: there is no unique or exclusion constraint matching the ON CONFLICT specification => addCONSTRAINT fix this
    await pool.query(createSessionTable);
    await pool.query(addCCONSTRAINT);
  }

  client.release();
  createTableConnect()

  console.log(`Server is running on port ${process.env.Port} - build1`);
});
