const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const oderModel = require("../models/order.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const { custom } = require("joi");
const orderModel = require("../models/order.model");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "development" ? false : true;
// success controller
exports.sucess = asyncHandler(async (req, res) => {
  const { val_id } = req.body;
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validatePayment = await sslcz.validate({
    val_id,
  });

  console.log("validatePayment", validatePayment);
  if (validatePayment.status !== "VALID")
    throw new customError(501, "payment not valid");
  await orderModel.findOneAndUpdate(
    { transactionId: validatePayment.tran_id },
    { paymentStatus: validatePayment.status ? "VALID" : "success" , valId:validatePayment.val_id ,
      paymentGatewayData: validatePayment
    }
  );

  res.redirect('http://localhost:5174/success')
});

exports.fail = asyncHandler(async (req, res) => {
  res
    .status(301)
    .redirect(
      "https://github.com/taufik69/zCommerce/blob/main/src/controller/order.controller.js"
    );
});

exports.cancel = asyncHandler(async (req, res) => {
  res
    .status(301)
    .redirect(
      "https://github.com/taufik69/zCommerce/blob/main/src/controller/order.controller.js"
    );
});

exports.ipn = asyncHandler(async (req, res) => {
  
  res
    .status(301)
    .redirect(
      "https://github.com/taufik69/zCommerce/blob/main/src/controller/order.controller.js"
    );
});
