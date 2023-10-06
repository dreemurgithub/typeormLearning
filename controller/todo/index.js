const todoRoute = require("express")();
const URL_LIST = require("../../constants");
const {
  addTodo,
  readTodoFromUser,
  updateTodo,
  deleteTodo,
} = require("../../models/postgresJs/index");

todoRoute.get(URL_LIST.sqlQueryTodo, async (req, res) => {
  const userId = req.session.userId;
  const todoList = await readTodoFromUser(userId);
  res.send(todoList);
});

todoRoute.post(URL_LIST.sqlQueryTodo, async (req, res) => {
  const { task, status } = req.body;
  if (!task || !status) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }
  await addTodo({ userId: req.session.userId, task, status });
  res.send({ task, status, created_at: new Date() });
});

todoRoute.put(URL_LIST.sqlQueryTodo, async (req, res) => {
  const { task, status, todo_id } = req.body;
  if (!task || !status || !todo_id) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }
  const userId =req.session.userId
  const newTodo = await updateTodo({ todo_id, task, status ,userId });
  res.send(newTodo);
});

todoRoute.put(`${URL_LIST.sqlQueryTodo}/delete`,async (req,res)=>{
    const {todo_id} = req.body
    const userId = req.session.userId
    const message = await deleteTodo(todo_id,userId)
    res.send(message)
});

// end sql query

todoRoute.get(URL_LIST.typeOrmTodo, async (req, res) => {
  res.send(`hello ${URL_LIST.typeOrmTodo}`);
});

module.exports = todoRoute;
