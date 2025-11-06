const express = require("express");
const _ = express.Router();
const courierController = require("../../controller/courier.controller");

// Route to create a new courier order
_.route("/create-order").post(courierController.createCourierOrder);
_.route("/create-bulk-orders").post(courierController.createBulkCourierOrders);
_.route("/courier-status").get(courierController.checkDeliveryStatus);
_.route("/current-balance").get(courierController.getCurrentBalance);
_.route("/create-return-request").post(courierController.createReturnRequest);
_.route("/return-request-status").get(courierController.getReturnRequestStatus);
_.route("/steadfastWebhookHandler").post(
  courierController.steadfastWebhookHandler
);

module.exports = _;
