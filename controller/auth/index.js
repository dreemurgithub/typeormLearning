const URL_LIST = require("../../constants");
const authRoute = require("express")();
const { pool } = require("../../config/postgresJs/index");

const {
  signInUserOrm,addUserOrm
} = require("../../models/typeorm/auth");


authRoute.delete(URL_LIST.logout, async (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.send({ message: "Logout" });
});

authRoute.post(`${URL_LIST.register}/orm`, async (req, res) => {
  const userInfor = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  };
  if (!userInfor.email || !userInfor.username || !userInfor.password) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }
  addUserOrm(userInfor);
  res.send(userInfor);
});

authRoute.post(`${URL_LIST.login}/orm`, async (req, res) => {
  const { email, password } = req.body;
  const oneUser = await signInUserOrm({ email, password });
  if (oneUser) {
    const client = await pool.connect();
    req.session.userId = oneUser.id
    // req.session.userId = oneUser.id
    client.release();
    res.send(oneUser);
  } else res.status(401).send({message:"Wrong Username/Password"})

});

module.exports = authRoute;
