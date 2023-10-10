const userRoute = require("express")();
const URL_LIST = require("../../constants");

const {deleteUserOrm,readAllUserOrm, readOneUserOrm,UdateOneUserOrm} = require("../../models/typeorm/index")

userRoute.get(URL_LIST.typeOrmUser, async (req, res) => {
  const user = await readAllUserOrm();
  res.send(user);
});

userRoute.get(`${URL_LIST.typeOrmUser}/:id`, async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await readOneUserOrm(id);
  res.send(user);
});

userRoute.put(URL_LIST.typeOrmUser, async (req, res) => {
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

  const user = await UdateOneUserOrm(userInfor);
  res.send(user);
});

userRoute.delete(`${URL_LIST.typeOrmUser}/:userId`, async (req, res) => {
  const userId = parseInt(req.params.userId);
  const message = await deleteUserOrm(userId);
  res.session.destroy()
  res.clearCookie("connect.sid")
  res.send(message);
});


module.exports = userRoute;
