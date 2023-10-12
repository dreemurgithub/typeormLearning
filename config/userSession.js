const expressSession = require("express-session");
const connectPg =  require("connect-pg-simple")
const store = connectPg(expressSession)
const { pool } = require("./postgresJs"); // start postgres, must have

const useSession = require('express')()

useSession.use(
    expressSession({
      store: new (require("connect-pg-simple")(expressSession))({
        pool: pool, // Connection pool
        tableName: "user_sessions", // Use another table-name than the default "session" one
      }),
      secret: "somesecret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days * 24 hour
        secure: process.env.ENVIROMENT === "DEV" ? "auto" : true,
        sameSite: process.env.ENVIROMENT === "DEV" ? "lax" : "none",
      }, // 30 days
      // for browser security requirement on https
    })
  );

  
  
  module.exports = useSession