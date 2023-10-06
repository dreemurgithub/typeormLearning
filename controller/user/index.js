const usertRoute = require("express")();
const URL_LIST = require("../../constants");
const {
  readUser,
  readAllUser,
  updateUser,
  deleteUser
} = require("../../models/postgresJs/index");

usertRoute.get(URL_LIST.sqlQueryUser, async (req, res) => {
  const user = await readAllUser();
  res.send(user.rows);
});

usertRoute.get(`${URL_LIST.sqlQueryUser}/:id`, async (req, res) => {
  const id = req.params.id;
  const user = await readUser(id);
  res.send(user.rows[0]);
});

usertRoute.put(URL_LIST.sqlQueryUser, async (req, res) => {
  const userInfor = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    id: req.body.id,
  };
  if (
    !userInfor.email ||
    !userInfor.username ||
    !userInfor.password ||
    !userInfor.id
  ) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  const user = await updateUser(userInfor);
  res.send(user);
});

usertRoute.delete(`${URL_LIST.sqlQueryUser}/:id`, async (req, res) => {
  const id = req.params.id;
  const message = await deleteUser(id);
  res.send(message);
});


// End SQL route

usertRoute.get(URL_LIST.typeOrmUser, async (req, res) => {
  const user = await readAllUser();
  res.send(user.rows);
});

usertRoute.get(`${URL_LIST.typeOrmUser}/:id`, async (req, res) => {
  const id = req.params.id;
  const user = await readUser(id);
  res.send(user.rows[0]);
});

usertRoute.put(URL_LIST.typeOrmUser, async (req, res) => {
  const userInfor = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    id: req.body.id,
  };
  if (
    !userInfor.email ||
    !userInfor.username ||
    !userInfor.password ||
    !userInfor.id
  ) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  const user = await updateUser(userInfor);
  res.send(user);
});

usertRoute.delete(`${URL_LIST.typeOrmUser}/:id`, async (req, res) => {
  const id = req.params.id;
  const message = await deleteUser(id);
  res.send(message);
});


module.exports = usertRoute;
