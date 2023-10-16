const { URL_LIST } = require("../../constants");
const authRoute = require("express")();
const { pool } = require("../../config/postgresJs/index");

const { signInUserOrm, addUserOrm } = require("../../models/typeorm/auth");

authRoute.delete(URL_LIST.logout, async (req, res) => {
  if(req.session) req.session.destroy();
  res.clearCookie("connect.sid");
  res.send({ message: "Logout" });
});

authRoute.post(`${URL_LIST.register}/orm`, async (req, res) => {
  const result = await addUserOrm(req.body);
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });
});

authRoute.post(`${URL_LIST.login}/orm`, async (req, res) => {
  const { email, password } = req.body;
  const result = await signInUserOrm({ email, password });
  if (result.success) {
    const client = await pool.connect();
    req.session.userId = result.data.id;
    // req.session.userId = result.id
    client.release();
    res.send(result.data);
  } else res.status(401).send({ message: result.message });
});

module.exports = authRoute;
