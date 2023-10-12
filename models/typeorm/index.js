const {commentRepository,todoRepository,userRepository,users_todoRepository} = require('../../config/typeorm')

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
  const newUser = await userRepository.find({ where: { id } });
  return newUser;
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
