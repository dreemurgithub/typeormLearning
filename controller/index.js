const controller = require("express")();
const authRoute = require("./auth");
const commentRoute = require('./comment')
const todoRoute = require('./todo')
const userRoute = require('./user')
const authMiddleware = require('./authMiddleware')

controller.use(authRoute)
controller.use(commentRoute)
controller.use(todoRoute)
controller.use(userRoute)
controller.use(authMiddleware)

module.exports = controller