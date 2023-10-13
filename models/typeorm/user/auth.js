const { userRepository } = require("../../../config/typeorm");
const {queryReadLogin, queryAddUser} = require('../../queryHelper/index')
const {emailRegex} = require('../../../constants')

const addUserOrm = async ({ username, email, password }) => {
  if(!username || !email || !password || !emailRegex.test(email)) return {
    success: false,
    message: "Bad Request"
  }
  const newUser = { username, email, password };
  const data = await queryAddUser({username,email,password});
  return {
    success: true,
    data
  }
};

const signInUserOrm = async ({ email, password }) => {
  const userList = await queryReadLogin({email,password});
  if(userList.length) return {
    success: true,
    data: userList[0]
  } 
  else return {
    success: false,
    message: "Wrong Email/Password"
  }
};

module.exports = { signInUserOrm, addUserOrm };
