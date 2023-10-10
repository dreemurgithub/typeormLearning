require("dotenv").config();
const isLocalhost = process.env.ENVIROMENT === "DEV";

// const Users = require('./user')

const UsersSchema = require("./UserSchema");
const users_todoSchema = require("./users_todoSchema");
const todoSchema = require("./todoSchema");
const commentSchema = require("./commentSchema");

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

const addUserOrm = async ({ username, email, password }) => {
  const newUser = { username, email, password };
  await userRepository.save(newUser);
};

const readAllUserOrm = async () => {
  const users = await userRepository.find();
  return users;
};

const readOneUserOrm = async (id) => {
  const users = await userRepository.find({ where: { id } });
  return users[0];
};

const UdateOneUserOrm = async ({ id, username, email, password }) => {
  await userRepository
    .createQueryBuilder("users")
    .update({ id })
    .set({ username, email, password })
    .where("id = :id", { id })
    .execute();
  const newuser = await userRepository.find({ where: { id } });
  return newuser;
};

const deleteUserOrm = async (userId) => {
  const arrTodoIdObj = await users_todoRepository.find({ user_id: userId });
  const arrTodoId = [];
  for (let i = 0; i < arrTodoIdObj.length; i++)
    arrTodoId.push(arrTodoIdObj[i].todo_id);
  try {
    // await commentRepository.delete({ author: userId });
    for (let i = 0; i < arrTodoId.length; i++) {
      let todo_id = arrTodoId[i];
      console.log(todo_id);
      await commentRepository.delete({ todo_id });
      await users_todoRepository.delete({ user_id: userId });
      await todoRepository.delete({ todo_id });
    }
    return { message: "Delete successfully" };
  } catch (err) {
    console.log(err);
    return { message: "Bad request" };
  }
};

const SignInUserOrm = async ({ email, password }) => {
  const user = await userRepository.findOne({ where: { email } });
  if (password === user.password) return user;
  return null;
};

const readTodoOrm = async (userId) => {
  const todo_idList = await users_todoRepository.find({
    select: ["todo_id"],
    where: { user_id: userId },
  });
  const allUser = [];
  console.log(todo_idList)
  for(let i=0;i<todo_idList.length;i++){
    const todo_id = todo_idList[i].todo_id
    const todo = await todoRepository.find({ where: { todo_id } })
    allUser.push(todo);
  }
  return allUser;
};

const addTodoOrm = async ({ userId, task, status }) => {
  const newTodo = { task, status };
  await todoRepository.save(newTodo);
  console.log(newTodo);
  const newTodoUserLink = { todo_id: newTodo.todo_id, user_id: userId };
  await users_todoRepository.save(newTodoUserLink);
  return newTodo;
};

const updateTodoOrm = async ({ todo_id, task, status }) => {
  await todoRepository
    .createQueryBuilder("todo")
    .update({ todo_id })
    .set({ task, status })
    .where("todo_id = :todo_id", { todo_id })
    .execute();
  const newTodo = await todoRepository.find({ where: { todo_id } });
  return newTodo;
};

const deleteTodoOrm = async ({ userId, todo_id }) => {
  console.log({ userId, todo_id });
  try {
    await users_todoRepository.delete({ todo_id, user_id: userId });
    await todoRepository.delete({ todo_id });
    await commentRepository.delete({ todo_id });
    return { message: "Delete successful" };
  } catch (error) {
    console.log(error);
    return { message: "Bad Request" };
  }
};

const addCommentOrm = async ({ title, body, todo_id, userId }) => {
  const newComment = { title, body, todo_id, author: userId };
  console.log(newComment);
  await commentRepository.save(newComment);
  return newComment;
};

const readCommentUserOrm = async (userId) => {
  const allComment = await commentRepository.find({
    where: { author: userId },
  });
  return allComment;
};
const readCommentTodoOrm = async (todo_id) => {
  const allComment = await commentRepository.find({ where: { todo_id } });
  return allComment;
};

const updateCommentOrm = async ({ title, body, commentid, userId }) => {
  await commentRepository
    .createQueryBuilder("comment")
    .update({ title, body, commentid, author: userId })
    .set({ title, body })
    .where("commentid = :commentid", { commentid })
    .execute();
  const newComment = await commentRepository.find({ where: { commentid } });
  return newComment;
};

const deleteCommentOrm = async (commentid) => {
  try {
    await commentRepository.delete({ commentid });
    return { message: "Delete successfully" };
  } catch (err) {
    console.log(err);
    return { message: "Bad request" };
  }
};

module.exports = {
  dataSource,
  userRepository,
  users_todoRepository,
  commentRepository,
  todoRepository,
  createTableConnect,
  addUserOrm,
  readAllUserOrm,
  SignInUserOrm,
  UdateOneUserOrm,
  readTodoOrm,
  addTodoOrm,
  updateTodoOrm,
  deleteTodoOrm,
  addCommentOrm,
  readCommentUserOrm,
  readCommentTodoOrm,
  updateCommentOrm,
  deleteCommentOrm,
  deleteUserOrm,
  readOneUserOrm,
};
