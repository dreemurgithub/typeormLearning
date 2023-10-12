const { userRepository } = require("../../../config/typeorm");

const addUserOrm = async ({ username, email, password }) => {
  const newUser = { username, email, password };
  await userRepository.save(newUser);
};

const signInUserOrm = async ({ email, password }) => {
  const user = await userRepository.findOne({ where: { email } });
  if (password === user.password) return user;
  return null;
};

module.exports = { signInUserOrm, addUserOrm };
