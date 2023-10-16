const {
  queryAddComment,
  queryReadCommentUser,
  queryReadCommentTodo,
  queryUpdateComment,
  queryDeleteComment,
} = require("../../queryHelper");

const addCommentOrm = async ({ title, body, todo_id, userId }) => {
  if (!title || !body || !todo_id || !userId) {
    return {
      success: false,
      message: "Bad Request",
    };
  }
  const result = await queryAddComment({ title, body, todo_id, userId });
  return {
    success: true,
    data: result,
  };
};

const readCommentUserOrm = async (userId) => {
  try {
    const allComment = await queryReadCommentUser(userId);
    return { success: true, data: allComment };
  } catch {
    return { message: "Something wrong", success: false };
  }
};
const readCommentTodoOrm = async (todo_id) => {
  const todo_idNum = parseInt(todo_id);
  if (!isNaN(todo_idNum)) {
    const userList = await queryReadCommentTodo(todo_idNum);
    if (userList.length) {
      return {
        success: true,
        data: userList[0],
      };
    } else
      return {
        success: false,
        message: "No comment here",
      };
  }
  return {
    success: false,
    message: "Bad Request",
  };
};

const updateCommentOrm = async ({ title, body, commentid, userId }) => {
  if (!title || !body || !commentid || !userId) {
    return {
      success: false,
      message: "Bad Request",
    };
  }

  const result = await queryUpdateComment({ title, body, commentid, userId });
  if (result.length)
    return {
      success: true,
      data: { title, body, commentid, userId },
    };
  else
    return {
      success: false,
      message: "Can't update comment",
    };
};

const deleteCommentOrm = async (commentid) => {
  if (!commentid || isNaN(parseInt(commentid))) {
    return {
      success: false,
      message: "Bad Request",
    };
  }
  const result = await queryDeleteComment(commentid);
  if (result.affected)
    return {
      success: true,
      message: "Comment deleted",
    };
  else
    return {
      success: false,
      message: "Something wrong",
    };
};

module.exports = {
  addCommentOrm,
  readCommentTodoOrm,
  readCommentUserOrm,
  updateCommentOrm,
  deleteCommentOrm,
};
