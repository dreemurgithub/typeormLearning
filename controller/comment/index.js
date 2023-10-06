const commentRoute = require("express")();
const URL_LIST = require("../../constants");
const {
  addComment,
  readCommentTodo,
  updateComment,
  readCommentUser,
  deleteComment,
} = require("../../models/postgresJs");

commentRoute.get(URL_LIST.sqlQueryComment, async (req, res) => {
  const userId = req.session.userId;
  const commentList = await readCommentUser(userId);
  res.send(commentList);
});
commentRoute.get(`${URL_LIST.sqlQueryComment}/:todo_id`, async (req, res) => {
  const commentList = await readCommentTodo(req.params.todo_id);
  res.send(commentList);
});

commentRoute.post(URL_LIST.sqlQueryComment, async (req, res) => {
  const { title, body, todo_id } = req.body;
  const userId = req.session.userId;
  if (!title || !body || !todo_id || !userId) {
    res.send(400).send({ message: "Bad Request" });
    return
  }
  const message = await addComment({ todo_id, userId, body, title });
  res.send(message);
});

commentRoute.put(URL_LIST.sqlQueryComment, async (req, res) => {
  const { title, body,commentid } = req.body;
  const userId =req.session.userId
  const newComment = await updateComment({ title, body, commentid ,userId });
  res.send(newComment);
});

commentRoute.put(`${URL_LIST.sqlQueryComment}/delete`, async (req, res) => {
    const { commentid } = req.body;
    const userId =req.session.userId
    const message = await deleteComment(commentid);
    res.send(message);
  });

// end sql
commentRoute.get(URL_LIST.typeOrmComment, async (req, res) => {
  res.send(`hello ${URL_LIST.typeOrmComment}`);
});

commentRoute.post(URL_LIST.typeOrmComment, async (req, res) => {
  res.send(`hello ${URL_LIST.typeOrmComment}`);
});

commentRoute.put(URL_LIST.typeOrmComment, async (req, res) => {
  res.send(`hello ${URL_LIST.typeOrmComment}`);
});

module.exports = commentRoute;
