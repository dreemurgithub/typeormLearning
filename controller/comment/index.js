const commentRoute = require("express")();
const {URL_LIST} = require("../../constants");

const {
  addCommentOrm,
  readCommentUserOrm,
  readCommentTodoOrm,
  updateCommentOrm,
  deleteCommentOrm,
  UdateOneUserOrm,
} = require("../../models/typeorm/comment");


commentRoute.get(URL_LIST.typeOrmComment, async (req, res) => {
  const userId = req.session.userId;
  const commentList = await readCommentUserOrm(userId);
  res.send(commentList);
});
commentRoute.get(`${URL_LIST.typeOrmComment}/:todo_id`, async (req, res) => {
  const todo_id = req.params.todo_id
  const result = await readCommentTodoOrm(todo_id);
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });
});

commentRoute.post(URL_LIST.typeOrmComment, async (req, res) => {
  const { title, body, todo_id } = req.body;
  const userId = req.session.userId;
  const result = await addCommentOrm({title, body, todo_id, userId});
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });
});

commentRoute.put(URL_LIST.typeOrmComment, async (req, res) => {
  const {title, body, commentid} = req.body
  const userId = req.session.userId
  const result = await updateCommentOrm({title, body, commentid, userId});
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });
});

commentRoute.put(`${URL_LIST.typeOrmComment}/delete`, async (req, res) => {
  const { commentid } = req.body;
  const result = await deleteCommentOrm(commentid);
  if (result.success) res.status(200).send({ message: result.message });
  else res.status(400).send({ message: result.message });
});

module.exports = commentRoute;