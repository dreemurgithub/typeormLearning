require("dotenv").config();
const isLocalhost = process.env.ENVIROMENT === "DEV";

// const Users = require('./user')

const UsersSchema = require("./UserSchema");

// const Users_todo = require('./users_todo')
// const Todo = require('./todo')
// const Comment = require('./comment')

const typeorm = require("typeorm");
const dataSource = new typeorm.DataSource({
  type: "postgres",
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  // database: `${process.env.POSTGRES_DB}2`,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  host: isLocalhost ? process.env.POSTGRES_LOCAL : process.env.POSTGRES_HOST, // for docker-compose up db, to just run the database
  entities: [UsersSchema],
  // host:  process.env.POSTGRES_HOST, // this is for docker-compose up
});

const createTableConnect = () => {
  dataSource
    .initialize()
    .then(() => {
      console.log('Connected -duh')
    })
    .catch(function (error) {
      console.log("Error: ", error);
    });
};

const addUserOrm = ({ username, email, password }) => {
  const userRepository = dataSource.getRepository("Users");
  const newUser = { username, email, password};

  userRepository
    .save(newUser)
    .then((savedUser) => {
      console.log("User has been saved: ", savedUser);
      console.log("Now lets load all user: ");

      return userRepository.find();
    })
    .then((allUser) => {
      console.log("All posts: ", allUser);
    });
};

module.exports = { createTableConnect, addUserOrm, dataSource };
