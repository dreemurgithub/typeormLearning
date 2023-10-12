const {commentRepository,todoRepository,userRepository,users_todoRepository} = require("../../../config/typeorm");

const readTodoOrm = async (userId) => {
    const todo_idList = await users_todoRepository.find({
      select: ["todo_id"],
      where: { user_id: userId },
    });
    const allUser = [];
    for(let i=0;i<todo_idList.length;i++){
      const todo_id = todo_idList[i].todo_id
      const todo = await todoRepository.find({ where: { todo_id } })
      allUser.push(todo[0]);
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
  
  module.exports = {addTodoOrm,readTodoOrm,updateTodoOrm, deleteTodoOrm}