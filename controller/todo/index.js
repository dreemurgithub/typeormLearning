const todoRoute = require("express")();
const { URL_LIST } = require("../../constants");
const {
  addTodoOrm,
  readOwnTodoOrm,
  readUserFromTodo,
  updateTodoOrm,
  deleteTodoOrm,
} = require("../../models/typeorm/todo");

todoRoute.get(URL_LIST.typeOrmTodo, async (req, res) => {
  const userId = req.session.userId;
  const result = await readOwnTodoOrm(userId);
  if (result.success) res.status(200).send(result.data);
  else res.status(200).send({ message: result.message });
});

todoRoute.get(`${URL_LIST.typeOrmTodo}/:todo_id`, async (req, res) => {
  const result = await readUserFromTodo(req.params.todo_id);
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });
});

todoRoute.post(URL_LIST.typeOrmTodo, async (req, res) => {
  const { task, status } = req.body;
  const userId = req.session.userId;
  const result = await addTodoOrm({ userId, task, status });
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });
});

todoRoute.put(URL_LIST.typeOrmTodo, async (req, res) => {
  const { task, status, todo_id } = req.body;
  if (!task || !status || !todo_id) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }
  const userId = req.session.userId;
  const result = await updateTodoOrm({ todo_id, task, status });
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });
});

todoRoute.put(`${URL_LIST.typeOrmTodo}/delete`, async (req, res) => {
  const { todo_id } = req.body;
  const userId = req.session.userId;
  const result = await deleteTodoOrm({ todo_id, userId });
  if (result.success) res.status(200).send({ message: result.message });
  else res.status(400).send({ message: result.message });
});

module.exports = todoRoute;
