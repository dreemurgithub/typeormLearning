require("dotenv").config();
const express = require("express");
const app = express();


const { createTableConnect } = require("./config/typeorm");
const controller = require('./controller')
const { pool } = require("./config/postgresJs/index");
const configFunction =require('./config')
const startSessionTable = require('./config/postgresJs/startSession')

app.use(configFunction)
app.use(controller)

const port = process.env.PORT
app.listen(port, async () => {
  
  createTableConnect()
  startSessionTable()

  console.log(`Server is running on port ${port} - build1`);
});
