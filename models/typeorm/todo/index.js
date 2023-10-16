const {
  queryAddTodo,
  queryAddUserTodo,
  queryreadTodoUserFromLink,
  queryReadOneUser,
  queryReaduserInTodo,
  queryReadOneTodoId,
  queryUpdateTodo,
  queryReadCommentTodo,
  queryDeleteComment,
  queryDeleteTodo,
  queryRemoveOneLink,
} = require("../../queryHelper");

const readOwnTodoOrm = async (userId) => {
  try {
    const todo_idListObj = await queryreadTodoUserFromLink(userId);
    const todo_idList = [];
    todo_idListObj.forEach((el) => todo_idList.push(el.todo_id));
    const allUser = [];
    for (let i = 0; i < todo_idList.length; i++) {
      const todo_id = todo_idList[i];
      const todo = await queryReadOneTodoId(todo_id);
      allUser.push(todo);
    }
    return { data: allUser, success: true };
  } catch {
    return { message: "Something wrong", success: false };
  }
};

const readUserFromTodo = async (todo_id) => {
  if (!todo_id || isNaN(parseInt(todo_id)))
    return { success: false, message: "Bad Request -x" };
  const user_idListObj = await queryReaduserInTodo(todo_id);
  const user_idList = [];
  user_idListObj.forEach((el) => user_idList.push(el.user_id));
  const allUser = [];
  for (let i = 0; i < user_idList.length; i++) {
    const user_id = user_idList[i];
    const user = await queryReadOneUser(user_id);
    allUser.push(user);
  }
  if (allUser.length) return { data: allUser, success: true };
  else return { success: false, message: "No user here" };
};

const addTodoOrm = async ({ userId, task, status }) => {
  if (!task || !status || !userId) {
    return { success: false, message: "Bad Request" };
  }
  const newTodo = { task, status, userId };
  const result = await queryAddTodo(newTodo);
  if (result.success) {
    await queryAddUserTodo({ todo_id: result.data.todo_id, userId });
    return result;
  } else return { success: false, message: "Something wrong" };
};

const updateTodoOrm = async ({ todo_id, task, status }) => {
  if (!todo_id || !task || !status) {
    return { success: false, message: "Bad Request" };
  }
  const result = await queryUpdateTodo({ todo_id, task, status });
  if (result.affected)
    return { success: true, data: { todo_id, task, status } };
  else return { success: false, message: "Something wrong" };
};

const deleteTodoOrm = async ({ userId, todo_id }) => {
  try {
    const allIdCommentListObj = await queryReadCommentTodo(todo_id);
    const allIdCommentList = [];
    allIdCommentListObj.forEach((comment) =>
      allIdCommentList.push(comment.commentid)
    );
    for (let i = 0; i < allIdCommentList.length; i++)
      if (allIdCommentList[i]) await queryDeleteComment(allIdCommentList[i]);
    await queryRemoveOneLink({ userId, todo_id });
    await queryDeleteTodo({ userId, todo_id });
    return { success: true, message: "Delete the todo and all the comment" };
  } catch {
    return { success: false, message: "Something wrong" };
  }
};

module.exports = {
  addTodoOrm,
  readOwnTodoOrm,
  updateTodoOrm,
  readUserFromTodo,
  deleteTodoOrm,
};
