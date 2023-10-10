const URL_LIST = require("../constants");
const {
  commentRepository,
  users_todoRepository,
} = require("../models/typeorm/index");
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
    next();
    return;
  }
  const { commentid, todo_id, id } = req.body;

  // allow update if comment's author === userId and todo_id is in correct comment
  // allow delete if comment's author === userId, and there is no todo_id
  if (commentid && (req.method === "PUT" || req.method === "DELETE")) {
    const urlAllow = await checkAuthSession("comment", {
      userId,
      commentid,
      todo_id,
      id,
    });
    if (urlAllow.includes(req.url)) {
      next();
      return;
    }
  }

  // allow edit/delete if users is authenticated + todo belong to user

  if (
    !commentid &&
    todo_id &&
    (req.method === "PUT" || req.method === "DELETE")
  ) {
    const urlAllow = await checkAuthSession("todo", {
      userId,
      commentid,
      todo_id,
      id,
    });
    if (urlAllow.includes(req.url)) {
      next();
      return;
    }
  }
  // allow delete and edit if userId === id
  if (
    !commentid &&
    !todo_id &&
    id &&
    (req.method === "PUT" || req.method === "DELETE")
  ) {
    const urlAllow = await checkAuthSession("users", {
      userId,
      commentid,
      todo_id,
      id,
    });
    if (urlAllow.includes(req.url)) {
      next();
      return;
    }
  }
  res.status(401).send({ message: "Not Allowed" });
};

const checkAuthSession = async (table, { userId, commentid, todo_id, id }) => {
  if (table === "users") {
    if (id === userId)
      return [`${URL_LIST.typeOrmUser}/delete`, URL_LIST.typeOrmUser,`${URL_LIST.typeOrmUser}/${id}`];
    else return [];
  }
  if (table === "todo") {
    const todosArr = await users_todoRepository
      .createQueryBuilder()
      .where({ user_id: userId })
      .getMany();
    const todoArrId = [];
    for (let i = 0; i < todosArr.length; i++)
      todoArrId.push(todosArr[i].todo_id);
    if (todoArrId.includes(todo_id))
      return [`${URL_LIST.typeOrmTodo}/delete`, URL_LIST.typeOrmTodo];
    else return [];
  }
  if (table === "comment") {
    const commentAllow = await commentRepository
      .createQueryBuilder()
      .where({ commentid })
      .getOne();
    if (commentAllow.todo_id === todo_id && commentAllow.author === userId)
      return [URL_LIST.typeOrmComment];
    if (!todo_id && commentAllow.author === userId)
      return [`${URL_LIST.typeOrmComment}/delete`];
    return [];
  }

  return [];
};

module.exports = authMiddleware;
