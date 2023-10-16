const controller = require("express")();
const authRoute = require("./auth");
const commentRoute = require("./comment");
const todoRoute = require("./todo");
const userRoute = require("./user");
const authMiddleware = require("./authMiddleware");

controller.use((err, req, res, next) => { // exception handler for all
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

controller.use(authRoute);
// controller.use(authMiddleware); // block for authenticated user only
controller.use(commentRoute);
controller.use(todoRoute);
controller.use(userRoute);


module.exports = controller;
