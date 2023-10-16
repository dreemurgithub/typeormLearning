const userRoute = require("express")();
const { URL_LIST } = require("../../constants");

const {
  deleteUserOrm,
  readAllUserOrm,
  readOneUserOrm,
  UdateOneUserOrm,
} = require("../../models/typeorm/user");

userRoute.get(URL_LIST.typeOrmUser, async (req, res) => {
  const result = await readAllUserOrm();
  if (result.success) res.status(200).send(result.data);
  else res.status(200).send({ message: result.message });
});

userRoute.get(`${URL_LIST.typeOrmUser}/:id`, async (req, res) => {
  const id = req.params.id;
  const result = await readOneUserOrm(id);
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });
});

userRoute.put(URL_LIST.typeOrmUser, async (req, res) => {
  const userInfor = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    id: req.body.id,
  };
  const result = await UdateOneUserOrm(userInfor);
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });
});

userRoute.put(`${URL_LIST.typeOrmUser}/delete`, async (req, res) => {
  const id = req.body.id;
  const userId = req.session.userId;
  console.log(id, userId);
  const result = await deleteUserOrm({ id, userId });
  if (result.success) {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).send({ message: result.message });
  } else res.status(400).send({ message: result.message });
});

module.exports = userRoute;
