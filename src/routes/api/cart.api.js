const express = require("express");
const _ = express.Router();
const cartController = require("../../controller/cart.controller");
_.route("/addtocart").post(cartController.addToCart);
_.route('/getusercart').get(cartController.getCartbyUser)
_.route("/applycoupon").post(cartController.applyCoupon);
_.route("/increment").post(cartController.incremenItemQuantity);
_.route("/decrement").post(cartController.dectementItemQuantity);
_.route("/remove-cart").post(cartController.removeCartItem);
module.exports = _;
