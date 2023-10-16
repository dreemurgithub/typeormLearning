const {
  commentRepository,
  todoRepository,
  userRepository,
  usersTodoRepository,
} = require("../../config/typeorm");

const queryAddUser = async ({ username, email, password }) => {
  const newUser = { username, email, password };
  await userRepository.save(newUser);
};

const queryReadLogin = async ({ email, password }) => {
  const user = await userRepository.find({ where: { email, password } });
  return user;
};

const queryReadAllUser = async () => {
  const users = await userRepository.find();
  return users;
};

const queryReadOneUser = async (id) => {
  const userList = await userRepository.find({ where: { id } });
  return userList[0];
};

const queryReaduserInTodo = async (todo_id) => {
  const userList = await usersTodoRepository.find({ where: { todo_id } });
  return userList;
};

const queryUdateOneUser = async ({ id, username, email, password }) => {
  const result = await userRepository
    .createQueryBuilder("users")
    .update({ id })
    .set({ username, email, password })
    .where("id = :id", { id })
    .execute();
  return result;
};

const queryDeleteUser = async (userId) => {
  await userRepository.delete({  id: userId  });
};

const queryReadOneTodoId = async (todo_id) => {
  const todo = await todoRepository.find({ where: { todo_id } });
  return todo[0];
};

const queryreadTodoUserFromLink = async (userId) => {
  const todo_idList = await usersTodoRepository.find({
    select: ["todo_id"],
    where: { user_id: userId },
  });
  return todo_idList;
};

const queryAddTodo = async ({ userId, task, status }) => {
  const newTodo = { task, status };
  if (!task || !status || !userId) {
    return { success: false, message: "Bad Request" };
  }
  const data = await todoRepository.save(newTodo);
  return { data, success: true };
};

const queryAddUserTodo = async ({ userId, todo_id }) => {
  const newTodoUserLink = { user_id: userId, todo_id };
  await usersTodoRepository.save(newTodoUserLink);
};

const queryRemoveOneLink = async({ userId, todo_id }) =>{
  const result = await usersTodoRepository.delete( {user_id: userId, todo_id})
}

const queryUpdateTodo = async ({ todo_id, task, status }) => {
  const result = await todoRepository
    .createQueryBuilder("todo")
    .update({ todo_id })
    .set({ task, status })
    .where("todo_id = :todo_id", { todo_id })
    .execute();
  // const newTodo = await todoRepository.find({ where: { todo_id } });
  return result;
};

const queryDeleteTodo = async ( todo_id ) => {
  await todoRepository.delete({ todo_id });
};

const queryAddComment = async ({ title, body, todo_id, userId }) => {
  const newComment = { title, body, todo_id, author: userId };
  const result = await commentRepository.save(newComment);
  return result;
};

const queryReadCommentUser = async (userId) => {
  const allComment = await commentRepository.find({
    where: { author: userId },
  });
  return allComment;
};
const queryReadCommentTodo = async (todo_id) => {
  const allComment = await commentRepository.find({ where: { todo_id } });
  return allComment;
};

const queryUpdateComment = async ({ title, body, commentid, userId }) => {
  await commentRepository
    .createQueryBuilder("comment")
    .update({ title, body, commentid, author: userId })
    .set({ title, body })
    .where("commentid = :commentid", { commentid })
    .execute();
  const newComment = await commentRepository.find({ where: { commentid } });
  return newComment;
};

const queryDeleteComment = async (commentid) => {
  const result = await commentRepository.delete({ commentid });
  return result;
};

module.exports = {
  queryAddComment,
  queryReadCommentTodo,
  queryReadCommentUser,
  queryUpdateComment,
  queryDeleteComment,

  queryAddUser,
  queryReadLogin,
  queryReadOneUser,
  queryReadOneTodoId,
  queryReadAllUser,
  queryUdateOneUser,
  queryDeleteUser,
  queryRemoveOneLink,

  queryAddTodo,
  queryUpdateTodo,
  queryAddUserTodo,
  queryReaduserInTodo,
  queryreadTodoUserFromLink,
  queryReadOneTodoId,
  queryUpdateTodo,
  queryDeleteTodo,
};
