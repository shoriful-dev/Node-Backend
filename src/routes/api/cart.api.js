const express = require("express");
const _ = express.Router();
const cartController = require("../../controller/cart.controller");
_.route("/addtocart").post(cartController.addToCart);
module.exports = _;
