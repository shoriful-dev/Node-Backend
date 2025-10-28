const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");
const deliveryChargeModel = require("../models/deliveryCharge.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/varinant.model");
const { validateOrder } = require("../validation/order.validation");

// create an order
exports.createOrder = asyncHandler(async (req, res) => {
  const { user, guestId, shippinfo, deliveryCharge } = await validateOrder(req);
  const cartQuery = user ? { user } : { guestId };
  const cart = await cartModel.findOne(cartQuery);

  let product = null;
  let variant = null;
  //    stock reduce
  const productVarintinfo = await Promise.all(
    cart.items.map((orderItem) => {
      if (orderItem.product) {
        productModel.findOneAndUpdate(
          { _id: orderItem.product },
          {
            $inc: { stock: -orderItem.quantity, totalSale: orderItem.quantity },
          }
        );
      } else {
        variantModel.findOneAndUpdate(
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

  console.log(productVarintinfo);
});
