const { URL_LIST } = require("../constants");
const { commentRepository, usersTodoRepository } = require("../config/typeorm");
const { readCommentUserOrm } = require("../models/typeorm/comment");
const { readOwnTodoOrm } = require("../models/typeorm/todo");
const { readOneUserOrm } = require("../models/typeorm/user");
const urlKeys = Object.keys(URL_LIST);
const urlRoutes = urlKeys.map((el) => URL_LIST[el]);
const authMiddleware = async (req, res, next) => {
  // allow login and logout and create new user
  const autoPass =
    req.url === URL_LIST.login ||
    req.url === `${URL_LIST.login}/orm` ||
    req.url === URL_LIST.logout ||
    req.url === URL_LIST.register ||
    req.url === `${URL_LIST.register}/orm`;
  const userId = req.session.userId; // authenticated user
  // allow POST and GET for authenticated user, new todo/comment are base on the userId
  if (autoPass || ((req.method === "GET" || req.method === "POST") && userId)) {
    console.log(userId);
    next();
    return;
  }
  const { commentid, todo_id, id } = req.body;
  if (commentid && req.method === "PUT" && !todo_id && !id) {
    const allowCommentId = await allowComment(userId);
    if (allowCommentId.includes(commentid)) {
      next();
      return;
    }
  }

  if (todo_id && req.method === "PUT" && !commentid && !id) {
    const allowTodoId = await allowTodo(userId);
    if (allowTodoId.includes(todo_id)) {
      next();
      return;
    }
  }
  if (id && req.method === "PUT" && !commentid && !todo_id) {
    if (id === userId) {
      next();
      return;
    }
  }

  res.status(401).send({ message: "Not Allowed" });
};

const allowComment = async (userId) => {
  const commentResult = await readCommentUserOrm(userId);
  const commentListObj = commentResult.success ? commentResult.data : [];
  const allowCommentid = [];
  commentListObj.forEach((comment) => {
    if (comment) allowCommentid.push(comment.commentid);
  });
  return allowCommentid;
};

const allowTodo = async (userId) => {
  const todoResult = await readOwnTodoOrm(userId);
  const todoListObj = todoResult.success ? todoResult.data : [];
  const allowTodoId = [];
  todoListObj.forEach((todo) => {
    if (todo) allowTodoId.push(todo.todo_id);
  });
  return allowTodoId;
};

module.exports = authMiddleware;
