const todoRoute = require("express")();
const URL_LIST = require("../../constants");

todoRoute.get(URL_LIST.typeOrmTodo, async (req, res) => {
  const allTOdo = await readTodoOrm();
  // const allTOdo = await readTodoOrm()
  res.send(allTOdo);
});

todoRoute.post(URL_LIST.typeOrmTodo, async (req, res) => {
  const { task, status } = req.body;
  const userId = req.session.userId;
  if (!task || !status) {
    res.status(400).send({ message: "Bad request" });
  }
  const newTodo = await addTodoOrm({ userId, task, status });
  // const newTodo = await readTodoOrm()
  res.send(newTodo);
});

todoRoute.put(URL_LIST.typeOrmTodo, async (req, res) => {
  const { task, status, todo_id } = req.body;
  if (!task || !status || !todo_id) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }
  const userId = req.session.userId;
  const newTodo = await updateTodoOrm({ todo_id, task, status });
  res.send(newTodo);
});

todoRoute.put(`${URL_LIST.typeOrmTodo}/delete`, async (req, res) => {
  const { todo_id } = req.body;
  const userId = req.session.userId;
  const message = await deleteTodoOrm({ todo_id, userId });
  res.send(message);
});

module.exports = todoRoute;
