const {commentRepository,todoRepository,userRepository,users_todoRepository} = require("../../../config/typeorm");


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
  
  module.exports = {readAllUserOrm,readOneUserOrm, UdateOneUserOrm, deleteUserOrm}