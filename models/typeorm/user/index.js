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
  queryDeleteUser
} = require("../../queryHelper/index");
const { emailRegex } = require("../../../constants");
const readAllUserOrm = async () => {
  const users = await queryReadAllUser();
  return users;
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
    }
  else return {
    success: false,
    message: "No record was updated"
  }
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

module.exports = {
  readAllUserOrm,
  readOneUserOrm,
  UdateOneUserOrm,
  deleteUserOrm,
};
