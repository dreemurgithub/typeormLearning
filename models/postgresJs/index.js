require("dotenv").config();

const isLocalhost = process.env.ENVIROMENT === "DEV";

// if(process.env.PostgressqlURI) mongoose.connect(process.env.PostgressqlURI)
// somehow client work, not pool
const { Pool } = require("pg");

const pool = new Pool({
  port: process.env.POSTGRES_PORT, // Postgres server port[s]
  database: process.env.POSTGRES_DB, // Name of database to connect to
  user: process.env.POSTGRES_USER, // Username of database user
  password: process.env.POSTGRES_PASSWORD, // Password of database user
  host: isLocalhost ? process.env.POSTGRES_LOCAL : process.env.POSTGRES_HOST, // for docker-compose up db, to just run the database
  // host:  process.env.POSTGRES_HOST, // this is for docker-compose up

});

const readAllUser = async () => {
  const client = await pool.connect();
  const user = await pool.query(`select * from users;`);
  client.release();
  return user.rows;
};

const readUser = async (id) => {
  const client = await pool.connect();
  const user = await pool.query(`select * from users where id=${id};`);
  client.release();
  return user;
};

const addUser = async ({ email, username, password }) => {
  const client = await pool.connect();
  const query = `INSERT INTO Users (username, email,  password) VALUES ($1,$2,$3);`;
  const values = [username, email, password];
  await pool.query(query, values);
  const user = { email: email, username: username };
  client.release();
  return user;
};

const updateUser = async ({ id, email, username, password }) => {
  const client = await pool.connect();
  const query = `UPDATE Users SET username = $1, email = $2, password = $3,updated_at =$5 WHERE id = $4`;
  const values = [username, email, password, id, new Date()];
  await pool.query(query, values);
  const user = { email: email, username: username };

  client.release();
  return user;
};

const deleteUser = async (id) => {
  const client = await pool.connect();
  const query = `DELETE FROM Users WHERE id = $1`;
  const values = [id];
  try {
    await pool.query(query, values);
    const message = { message: "successful delete" };
    client.release();
    return message;
  } catch {
    const message = { message: "bad request" };
    client.release();
    return message;
  }
};

const readTodoFromUser = async (userId) => {
  const client = await pool.connect();
  const query = `select todo_id from users_todo where user_id = ${userId}`;
  const todo = await pool.query(query);
  const todo_id = [];
  for (let i = 0; i < todo.rowCount; i++) todo_id.push(todo.rows[i].todo_id);
  const todo_list = [];

  for (let i = 0; i < todo_id.length; i++) {
    const item = await pool.query(`select * from todo where todo_id = ${todo_id[i]};`);
    todo_list.push(item.rows[0]);
  }
  client.release();
  const a = todo_list;
  return todo_list;
};

const addTodo = async ({ userId, task, status }) => {
  const client = await pool.connect();
  const timeCheck = new Date();
  const query = `insert into todo (task, status, created_at) values ($1 , $2, $3);`;
  await pool.query(query, [task, status, timeCheck]);
  const addedTodoIdOne = await pool.query(
    `select todo_id from todo where task = $1 and status = $2 and created_at = $3`,
    [task, status, timeCheck]
  );
  await pool.query(
    `insert into users_todo (user_id,todo_id) values ($1 , $2);`,
    [userId, addedTodoIdOne.rows[0].todo_id]
  );
  client.release();
};


const updateTodo = async ({todo_id,task,status,userId}) => {
  const client = await pool.connect();
  // const queryCheck = await pool.query(`select * from users_todo where todo_id= $1 and user_id = $2`,[todo_id,userId])
  // if(!queryCheck.rowCount) return null
  const timeCheck = new Date();
  const query = `UPDATE todo SET status = $1, task = $2, updated_at = $4 WHERE todo_id = $3`;
  await pool.query(query,[status,task,todo_id,timeCheck])
  client.release();
  return {todo_id,task,status,updated_at: timeCheck};
};

const deleteTodo = async (todo_id,userId) => {
  const client = await pool.connect();
  try {
    pool.query(`DELETE FROM todo WHERE todo_id = $1`,[todo_id])
    const message = {message: "Delete successfully"};
    pool.query(`DELETE FROM users_todo WHERE todo_id = $1 and user_id = $2`,[todo_id,userId])
    client.release();
    return message
  } catch {
    const message = {message: "Bad Request"};
    return message
  }

};

const readCommentTodo = async (todo_id) => {
  const client = await pool.connect();
  if(!todo_id) return []
  const query = `select * from comment where todo_id = ${todo_id};`;
  const comment = await pool.query(query)
  client.release();
  return comment.rows;
};

const readCommentUser = async (userId) => {
  const client = await pool.connect();
  if(!userId) return []
  const query = `select * from comment where author = ${userId};`;
  const comment = await pool.query(query)
  client.release();
  return comment.rows;
};

const addComment = async ({todo_id, userId,title,body,}) => {
  const client = await pool.connect();
  const query = `INSERT INTO comment (title, body, todo_id, author,created_at) VALUES ($1, $2, $3, $4 ,$5)`;
  try {
    await pool.query(query,[title,body,todo_id,userId,new Date()])
    client.release();
    return {message: "Added new comment"}
  } catch {

    client.release();
    return {message: 'Bad Request'}
  }

};

const updateComment = async ({commentid,title,body,userId}) => {
  const client = await pool.connect();
  const query = `UPDATE comment SET title = $1, body = $2, updated_at = $3 WHERE commentid = $4 and author= $5`;
  const updated_at = new Date()
  await pool.query(query,[title,body,updated_at,commentid,userId])
  client.release();
  return {title,body,updated_at};
};

const deleteComment = async (commentid) => {
  const client = await pool.connect();
  try {
    await pool.query(`DELETE FROM comment WHERE commentid = $1;`,[commentid])
    client.release();
    return {message: "Delete successfully"}
  } catch {
    client.release()
    return {message: "Bad request"}
  }
};


module.exports = {
  pool,
  addComment,
  addTodo,
  addUser,
  deleteComment,
  deleteTodo,
  deleteUser,
  readCommentTodo,
  readTodoFromUser,
  readUser,
  updateComment,
  updateTodo,
  updateUser,
  readAllUser,
  readCommentUser
};
