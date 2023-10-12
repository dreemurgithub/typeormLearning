const commentRoute = require("express")();
const URL_LIST = require("../../constants");

const {
  addCommentOrm,
  readCommentUserOrm,
  readCommentTodoOrm,
  updateCommentOrm,
  deleteCommentOrm,
} = require("../../models/typeorm/comment");


commentRoute.get(URL_LIST.typeOrmComment, async (req, res) => {
  const userId = req.session.userId;
  const commentList = await readCommentUserOrm(userId);
  res.send(commentList);
});
commentRoute.get(`${URL_LIST.typeOrmComment}/:todo_id`, async (req, res) => {
  const todo_id = parseInt(req.params.todo_id)? parseInt(req.params.todo_id) : null
  const commentList = todo_id? await readCommentTodoOrm(todo_id) : [];
  res.send(commentList);
});

commentRoute.post(URL_LIST.typeOrmComment, async (req, res) => {
  const { title, body, todo_id } = req.body;
  const userId = req.session.userId;
  if (!title || !body || !todo_id || !userId) {
    // console.log({title, body, todo_id, userId})
    res.send(400).send({ message: "Bad Request" });
    return;
  }
  const newComment = await addCommentOrm({ todo_id, userId, body, title });
  res.send(newComment);
});

commentRoute.put(URL_LIST.typeOrmComment, async (req, res) => {
  const { title, body, commentid } = req.body;
  const userId = req.session.userId;
  const newComment = await updateCommentOrm({ title, body, commentid, userId });
  res.send(newComment);
});

commentRoute.put(`${URL_LIST.typeOrmComment}/delete`, async (req, res) => {
  const { commentid } = req.body;
  const userId = req.session.userId;
  const message = await deleteCommentOrm(commentid);
  res.send(message);
});

module.exports = commentRoute;