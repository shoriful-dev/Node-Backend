require("dotenv").config();
const SSLCommerzPayment = require("sslcommerz-lts");
const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");

// Models
const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");
const deliveryChargeModel = require("../models/deliveryCharge.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/varinant.model");
const invoiceModel = require("../models/invoice.model");

// Helpers
const { validateOrder } = require("../validation/order.validation");
const { getTransactionId, getProductName } = require("../helpers/uniqueid");
const { default: mongoose } = require("mongoose");

// Environment variables
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.NODE_ENV !== "development";

// -----------------------------------------------------------------------------
// Helper: Calculate Delivery Charge
// -----------------------------------------------------------------------------
const applyDeliveryCharge = async (deliveryChargeId) => {
  try {
    return await deliveryChargeModel.findById(deliveryChargeId);
  } catch (error) {
    throw new customError(501, "Failed to apply delivery charge");
  }
};

// -----------------------------------------------------------------------------
// Controller: Create Order
// -----------------------------------------------------------------------------
exports.createOrder = asyncHandler(async (req, res) => {
  const { user, guestId, shippinfo, deliveryCharge, paymentMethod } =
    await validateOrder(req);

  const cartQuery = user ? { user } : { guestId };
  const cart = await cartModel.findOne(cartQuery);

  if (!cart) throw new customError(404, "Cart not found");

  // ---------------------------------------------------------------------------
  // Reduce stock and increase sales count
  // ---------------------------------------------------------------------------
  const productVariantInfo = await Promise.all(
    cart.items.map(async (item) => {
      const updateFields = {
        $inc: { stock: -item.quantity, totalSale: item.quantity },
      };

      if (item.product) {
        return productModel
          .findOneAndUpdate({ _id: item.product }, updateFields, { new: true })
          .select("-QrCode -barCode -updatedAt -tag -reviews");
      } else {
        return variantModel.findOneAndUpdate(
          { _id: item.variant },
          {
            $inc: {
              stockVariant: -item.quantity,
              totalSale: item.quantity,
            },
          },
          { new: true },
        );
      }
    }),
  );

  // ---------------------------------------------------------------------------
  // Create Order Object
  // ---------------------------------------------------------------------------
  const order = new orderModel({
    user,
    guestId,
    items: productVariantInfo,
    shippinfo,
    deliveryCharge,
    coupon: cart.coupon,
    discountAmount: cart.discountAmount,
  });

  // ---------------------------------------------------------------------------
  // Calculate Final Amount
  // ---------------------------------------------------------------------------
  const charge = await applyDeliveryCharge(deliveryCharge);
  order.finalAmount =
    Math.ceil(cart.totalAmountOfWholeProduct + charge.amount) -
    cart.discountAmount;
  order.deliveryZone = charge.name;

  // ---------------------------------------------------------------------------
  // Generate Transaction & Invoice
  // ---------------------------------------------------------------------------
  order.transactionId = getTransactionId();
  const productAllName = getProductName(order.items);

  const invoiceInstance = await invoiceModel.create({
    invoiceId: order.transactionId,
    order: order._id,
  });

  order.invoiceId = invoiceInstance.invoiceId;

  // ---------------------------------------------------------------------------
  // Handle Payment Methods
  // ---------------------------------------------------------------------------
  if (paymentMethod === "cod") {
    order.paymentMethod = "cod";
    order.paymentStatus = "Pending";
    await order.save();
    // await cartModel.findByIdAndDelete({ _id: cart._id });

    apiResponse.sendSuccess(
      res,
      201,
      "Order created successfully (COD)",
      order,
    );
  }

  if (paymentMethod === "online") {
    const paymentData = {
      total_amount: order.finalAmount,
      currency: "BDT",
      tran_id: order.transactionId,
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
      const response = await sslcz.init(paymentData);

      order.orderStatus = "Pending";
      order.paymentMethod = "online";
      order.totalQuantity = cart.totalproduct;
      await order.save();

      // Optionally remove cart after successful payment initiation
      await cartModel.findByIdAndDelete({ _id: cart._id });

      console.log("SSLCommerz Response:", response);
      apiResponse.sendSuccess(
        res,
        203,
        "order sucessfull",
        response.GatewayPageURL,
      );
      // return res.redirect(response.GatewayPageURL);
    } catch (error) {
      // Rollback stock and invoice if payment fails
      await Promise.all(
        cart.items.map((item) => {
          const rollbackFields = item.product
            ? { $inc: { stock: item.quantity, totalSale: -item.quantity } }
            : {
                $inc: {
                  stockVariant: item.quantity,
                  totalSale: -item.quantity,
                },
              };

          return item.product
            ? productModel.findOneAndUpdate(
                { _id: item.product },
                rollbackFields,
              )
            : variantModel.findOneAndUpdate(
                { _id: item.product },
                rollbackFields,
              );
        }),
      );

      await invoiceModel.findOneAndDelete({ invoiceId: order.invoiceId });
      throw new customError(501, `Payment initiation failed: ${error.message}`);
    }
  }
});

// -----------------------------------------------------------------------------
// Controller: Get All Orders
// -----------------------------------------------------------------------------
exports.getAllOrders = asyncHandler(async (req, res) => {
  let { phoneNumber , invoice } = req.query;

  const orders = await orderModel
    .find(
      phoneNumber
        ? { "shippinfo.phone": { $regex: phoneNumber, $options: "i" } }
        : invoice ? {invoiceId: invoice}
        : {}
    )
    .sort({ createdAt: -1 });
  if (!orders || orders.length === 0)
    throw new customError(404, "No orders found");
  apiResponse.sendSuccess(res, 200, "Orders retrieved successfully", orders);
});

// get order by order status
exports.getOrdersByStatus = asyncHandler(async (req, res) => {
  let { status } = req.query;
  console.log(req.query);
  let query = {};
  if (status == "Pending") {
    query.orderStatus = status;
  } else if (status == "Cancel") {
    query.orderStatus = status;
  } else if (status == "courierPending") {
    query.orderStatus = status;
  } else if (status == "Processing") {
    query.orderStatus = status;
  } else {
    query = {};
  }
  const orders = await orderModel
    .find(
    query)
    .sort({ createdAt: -1 });
  if (!orders || orders.length === 0)
    throw new customError(404, "No orders found");
  apiResponse.sendSuccess(res, 200, "Orders retrieved successfully", orders);
});

// get all orderStatus
exports.getAllOrdersStatus = asyncHandler(async (req, res) => {
  const orderstatus = await orderModel.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: "$count" },
        breakdown: {
          $push: {
            orderStatus: "$_id",
            count: "$count",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalOrders: 1,
        breakdown: 1,
      },
    },
  ]);

  apiResponse.sendSuccess(
    res,
    200,
    "Orders retrieved successfully",
    orderstatus,
  );
});

// -----------------------------------------------------------------------------
// UPDATE ORDER BY ID
// -----------------------------------------------------------------------------
exports.updateOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new customError(400, "Invalid Order ID");
  }

  // Perform update
  const updatedOrder = await orderModel.findOneAndUpdate(
    { _id: id },
    { orderStatus: status },
    { new: true },
  );

  if (!updatedOrder) throw new customError(404, "Order not found");

  apiResponse.sendSuccess(res, 200, "Order updated successfully", updatedOrder);
});

// qurier pending

exports.courierPending = asyncHandler(async (req, res) => {
  // Perform update
  const updatedOrder = await orderModel.find({ orderStatus: "CourierPending" });

  if (!updatedOrder) throw new customError(404, "Order not found");

  apiResponse.sendSuccess(
    res,
    200,
    "courier pending successfully",
    updatedOrder,
  );
});
