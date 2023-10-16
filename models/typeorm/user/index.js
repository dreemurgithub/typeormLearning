const {
  commentRepository,
  todoRepository,
  userRepository,
  users_todoRepository,
} = require("../../../config/typeorm");
const {
  queryReadAllUser,
  queryReadOneUser,
  queryUdateOneUser,
  queryDeleteUser,
  queryReadCommentUser,
  queryreadTodoUserFromLink,
  queryRemoveOneLink,
  queryDeleteComment,
  queryDeleteTodo,
} = require("../../queryHelper");
const { emailRegex } = require("../../../constants");
const readAllUserOrm = async () => {
  try{const users = await queryReadAllUser();
  return {data: users, success: true };
} catch {
  return{message: 'Something wrong', success: false }
}
};

const readOneUserOrm = async (id) => {
  const idNum = parseInt(id);
  if (!isNaN(idNum)) {
    const userList = await queryReadOneUser(idNum);
    if (userList.length) {
      return {
        success: true,
        data: userList[0],
      };
    } else
      return {
        success: false,
        message: "This user does not Exist",
      };
  }
  return {
    success: false,
    message: "Bad Request",
  };
};

const UdateOneUserOrm = async ({ id, username, email, password }) => {
  if (!email || !emailRegex.test(email) || !password || !username) {
    return {
      success: false,
      message: "Bad Request",
    };
  }
  const result = await queryUdateOneUser({ id, email, password, username });
  if (result.affected)
    return {
      success: true,
      data: { id, username, email, password },
    };
  else
    return {
      success: false,
      message: "No record was updated",
    };
};

const deleteUserOrm = async ({ id, userId }) => {
  if (id !== userId)
    return { message: "Don't have the permission", success: false };

  const arrCommentUserListObj = await queryReadCommentUser(userId);
  const arrCommentUserList = [];
  arrCommentUserListObj.forEach((comment) =>
    arrCommentUserList.push(comment.commentid)
  );

  const arrTodoIdList = [];
  const arrTodoIdListObj = await queryreadTodoUserFromLink(userId);
  arrTodoIdListObj.forEach((todo) => arrTodoIdList.push(todo.commentid));
  for (let i = 0; i < arrTodoIdListObj.length; i++)
    arrTodoIdList.push(arrTodoIdListObj[i].todo_id);
  try {
    // await commentRepository.delete({ author: userId });
    for (let i = 0; i < arrCommentUserList.length; i++) {
      let commentid = arrCommentUserList[i];
      await queryDeleteComment(commentid);
    }

    for (let i = 0; i < arrTodoIdList.length; i++) {
      let todo_id = arrTodoIdList[i];
      if (todo_id) {
        await queryRemoveOneLink({ userId, todo_id });
        await queryDeleteTodo(todo_id);
      }
    }
    await queryDeleteUser( userId );
    return { message: "Delete successfully", success: true };
  } catch (err) {
    console.log(err);
    return { message: "something wrong", success: false };
  }
};

module.exports = {
  readAllUserOrm,
  readOneUserOrm,
  UdateOneUserOrm,
  deleteUserOrm,
};
