const express = require("express");
const _ = express.Router();
const gatewayController = require("../../controller/paymentGateway.controller");

_.route("/success").post(gatewayController.sucess);
_.route("/fail").post(gatewayController.fail);
_.route("/cancel").post(gatewayController.cancel);
_.route("/ipn").post(gatewayController.ipn);

module.exports = _;
