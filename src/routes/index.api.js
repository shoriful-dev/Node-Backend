const express = require("express");
const _ = express.Router();

_.use("/auth", require("./api/user.api"));
_.use("/category", require("./api/category.api"));
_.use("/subcategory", require("./api/subCategory.api"));
_.use("/brand", require("./api/brand.api"));
_.use("/discount", require("./api/discount.api"));
_.use("/product", require("./api/product.api"));
_.use("/variant", require("./api/variant.api"));
_.use("/coupon", require("./api/coupon.api"));
_.use("/review", require("./api/review.api"));
_.use("/cart", require("./api/cart.api"));
_.use("/deliverycharge", require("./api/delivaryCharge.api"));
_.use("/order", require("./api/order.api"));
_.use("/payment", require("./api/paymentgateway.api"));
_.use("/courier", require("./api/courier.api"));
_.use("/role", require("./api/role.api"));
_.use("/permission", require("./api/permission.api"));
// user permisson
_.use("/adduser", require("./api/adduser.api"));

module.exports = _;
