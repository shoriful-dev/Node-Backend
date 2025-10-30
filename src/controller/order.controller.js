require("dotenv").config();
const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");
const deliveryChargeModel = require("../models/deliveryCharge.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/varinant.model");
const { validateOrder } = require("../validation/order.validation");
const { getTransactionId, getProductName } = require("../helpers/uniqueid");
const invoiceModel = require("../models/invoice.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "development" ? false : true;

// calculate deliveryCharge
const applyDeliveryCharge = async (deliveryCharge) => {
  try {
    return await deliveryChargeModel.findById(deliveryCharge);
  } catch (error) {
    throw new customError(501, "applyDeliveryCharge not performed");
  }
};

// create an order
exports.createOrder = asyncHandler(async (req, res) => {
  const { user, guestId, shippinfo, deliveryCharge, paymentMethod } =
    await validateOrder(req);
  const cartQuery = user ? { user } : { guestId };
  const cart = await cartModel.findOne(cartQuery);
  let order = null;
  //    stock reduce
  const productVarintinfo = await Promise.all(
    cart.items.map((orderItem) => {
      if (orderItem.product) {
        return productModel.findOneAndUpdate(
          { _id: orderItem.product },
          {
            $inc: { stock: -orderItem.quantity, totalSale: orderItem.quantity },
          }
        );
      } else {
        return variantModel.findOneAndUpdate(
          { _id: orderItem.product },
          {
            $inc: {
              stockVariant: -orderItem.quantity,
              totalSale: orderItem.quantity,
            },
          }
        );
      }
    })
  );

  order = await new orderModel({
    user,
    guestId,
    items: productVarintinfo,
    shippinfo,
  });

  order.deliveryCharge = deliveryCharge;
  order.coupon = cart.coupon;
  order.discountAmount = cart.discountAmount;

  // calculate deliveryCharge
  const charge = await applyDeliveryCharge(deliveryCharge);
  order.finalAmount =
    Math.ceil(cart.totalAmountOfWholeProduct + charge.amount) -
    cart.discountAmount;
  order.deliveryZone = charge.name;
  // get transactionid
  const transactionid = getTransactionId();
  const productAllName = getProductName(order.items);

  order.transactionId = transactionid;

  // make a invoice
  const invoiceInstance = await invoiceModel.create({
    invoiceId: order.transactionId,
    order: order._id,
  });
  // paymenyt infomation
  if (paymentMethod == "cod") {
    order.paymentMethod = "cod";
    order.paymentStatus = "Pending";
    order.invoiceId = invoiceInstance.invoiceId;
  } else {
    const data = {
      total_amount: order.finalAmount,
      currency: "BDT",
      tran_id: order.transactionId, // use unique tran_id for each api call
      success_url: "http://localhost:3000/api/v1/payment/success",
      fail_url: "http://localhost:3000/api/v1/payment/fail",
      cancel_url: "http://localhost:3000/api/v1/payment/cancel",
      ipn_url: "http://localhost:3000/api/v1/payment/ipn",
      shipping_method: "Courier",
      product_name: productAllName,
      product_category: "Electronic",
      product_profile: "general",
      cus_name: shippinfo.firstName,
      cus_email: shippinfo.email,
      cus_add1: shippinfo.address,
      cus_add2: shippinfo.address,
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: shippinfo.phone,
      ship_name: shippinfo.firstName,
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    try {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const response = await sslcz.init(data);
      order.orderStatus = "Pending";
      order.paymentMethod = "online";
      order.totalQuantity = cart.totalproduct;
      order.invoiceId = invoiceInstance.invoiceId;
      await order.save();
      // remove cart
      // await cartModel.findByIdAndDelete({ _id: cart._id });
      console.log(response);
      apiResponse.sendSuccess(res, 200, "easy checkout url", {
        url: response.GatewayPageURL,
      });
    } catch (error) {
      // product rollback
      await Promise.all(
        cart.items.map((orderItem) => {
          if (orderItem.product) {
            return productModel.findOneAndUpdate(
              { _id: orderItem.product },
              {
                $inc: {
                  stock: orderItem.quantity,
                  totalSale: -orderItem.quantity,
                },
              }
            );
          } else {
            return variantModel.findOneAndUpdate(
              { _id: orderItem.product },
              {
                $inc: {
                  stockVariant: orderItem.quantity,
                  totalSale: -orderItem.quantity,
                },
              }
            );
          }
        })
      );

      // delete invoice
      await invoiceModel.findOneAndDelete({ invoiceId: order.invoiceId });
      throw new customError(501, `payment initaed failed ${error}`);
    }
  }
});
