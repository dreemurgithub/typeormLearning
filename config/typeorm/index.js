require("dotenv").config();
const isLocalhost = process.env.ENVIROMENT === "DEV";

// const Users = require('./user')

const UsersSchema = require("./userSchema");
const users_todoSchema = require("./users_todoSchema");
const todoSchema = require("./todoSchema");
const commentSchema = require("./commentSchema");

const typeOrm = require("typeorm");
const dataSource = new typeOrm.DataSource({
  type: "postgres",
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  // database: `${process.env.POSTGRES_DB}2`,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  host: isLocalhost ? process.env.POSTGRES_LOCAL : process.env.POSTGRES_HOST, // for docker-compose up db, to just run the database
  entities: [UsersSchema, users_todoSchema, commentSchema, todoSchema],
  // host:  process.env.POSTGRES_HOST, // this is for docker-compose up
});
const userRepository = dataSource.getRepository("Users");
const todoRepository = dataSource.getRepository("todo");
const users_todoRepository = dataSource.getRepository("Users_todo");
const commentRepository = dataSource.getRepository("comment");

const createTableConnect = () => {
  dataSource
    .initialize()
    .then(() => {
      console.log("Connected -duh");
    })
    .catch(function (error) {
      console.log("Error: ", error);
    });
};

module.exports = {
  createTableConnect,
  userRepository,
  users_todoRepository,
  commentRepository,
  todoRepository,
};
