const express = require("express");
const userRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const orderController = require("../controllers/orderController");

userRouter.get(
  "/order-book",
  authMiddleware.authenticate, 
  orderController.getOrderBook
);

module.exports = userRouter;