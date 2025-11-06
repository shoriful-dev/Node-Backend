const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const ordermodel = require("../models/order.model");
const { api } = require("../helpers/axios");
const { default: mongoose } = require("mongoose");

// Controller to create a new courier order
exports.createCourierOrder = asyncHandler(async (req, res) => {
  const { orderid } = req.body;
  if (!mongoose.Types.ObjectId.isValid(orderid)) {
    throw new customError(401, "Invalid order ID");
  }
  const order = await ordermodel.findById(orderid);
  if (!order) {
    throw new customError(404, "Order not found");
  }
  const { invoiceId, shippinfo, finalAmount } = order;
  const courierPayload = {
    invoice: invoiceId,
    recipient_name: shippinfo.firstName,
    recipient_phone: shippinfo.phone,
    recipient_address: shippinfo.address,
    cod_amount: finalAmount,
  };
  const response = await api.post("/create_order", courierPayload);
  if (!response.data || response.data.status !== 200) {
    throw new customError(500, "Failed to create courier order");
  }
  const { consignment } = response.data;
  //   update order with courier info if needed
  order.courier.name = "Steadfast";
  order.courier.trackingId = consignment.tracking_code;
  order.courier.rawResponse = consignment;
  order.courier.status = consignment.status;
  order.orderStatus = consignment.status;
  await order.save();
  apiResponse.sendSuccess(res, 200, "Courier order created successfully", {
    trackingId: consignment.tracking_code,
    message: response.data.message,
    consignment,
  });
});

exports.createBulkCourierOrders = asyncHandler(async (req, res) => {
  const { orderIds } = req.body; // Array of order IDs from the request body

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    throw new customError(400, "Invalid or empty order IDs array");
  }

  // Initialize an array to hold results for all the orders
  const results = [];

  // Iterate through each order ID to process it individually
  for (let orderId of orderIds) {
    // Validate each order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      results.push({ orderId, status: "failed", message: "Invalid order ID" });
      continue; // Skip to the next order
    }

    // Fetch order from the database
    const order = await ordermodel.findById(orderId);
    if (!order) {
      results.push({ orderId, status: "failed", message: "Order not found" });
      continue;
    }

    const { invoiceId, shippinfo, finalAmount } = order;
    const courierPayload = {
      invoice: invoiceId,
      recipient_name: shippinfo.firstName,
      recipient_phone: shippinfo.phone,
      recipient_address: shippinfo.address,
      cod_amount: finalAmount,
    };

    try {
      // Create the courier order
      const response = await api.post("/create_order", courierPayload);

      if (!response.data || response.data.status !== 200) {
        results.push({
          orderId,
          status: "failed",
          message: "Failed to create courier order",
        });
        continue;
      }

      const { consignment } = response.data;

      // Update the order with courier info if needed
      order.courier.name = "Steadfast";
      order.courier.trackingId = consignment.tracking_code;
      order.courier.rawResponse = consignment;
      order.courier.status = consignment.status;
      order.orderStatus = consignment.status;
      await order.save();

      results.push({
        orderId,
        status: "success",
        trackingId: consignment.tracking_code,
        message: response.data.message,
      });
    } catch (error) {
      results.push({ orderId, status: "failed", message: error.message });
    }
  }

  // Send back the result of all the bulk order processing
  apiResponse.sendSuccess(res, 200, "Bulk courier orders processed", results);
});

// Checking Delivery Status
exports.checkDeliveryStatus = asyncHandler(async (req, res) => {
  const { trackingId } = req.query;
  const response = await api.get(`/status_by_trackingcode/${trackingId}`);

  if (!response.data || response.data.status !== 200) {
    throw new customError(500, "Failed to fetch delivery status");
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Delivery status fetched successfully",
    response.data
  );
});

// get current balance
exports.getCurrentBalance = asyncHandler(async (req, res) => {
  const response = await api.get("/get_balance");
  if (!response.data || response.data.status !== 200) {
    throw new customError(500, "Failed to fetch current balance");
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Current balance fetched successfully",
    response.data
  );
});

// create return request
exports.createReturnRequest = asyncHandler(async (req, res) => {
  const { consignment_id } = req.body;

  if (!consignment_id) {
    throw new customError(400, "Consignment ID is required");
  }
  const response = await api.post("/create_return_request", {
    consignment_id,
    reason: "Customer Request",
  });

  if (!response.data) {
    throw new customError(500, "Failed to create return request");
  }

  // find order and update its status
  const order = await ordermodel.findOne({
    invoiceId: response.data.consignment.invoice,
  });
  if (!order) {
    throw new customError(404, "Order not found");
  }
  order.returnStatus = "requested";
  order.returnId = response.data.id;
  order.orderStatus = response.data.status;
  order.returnStatusHistory = response.data;

  await order.save();
  apiResponse.sendSuccess(
    res,
    200,
    "Return request created successfully",
    response.data
  );
});

// Single Return Request View
exports.getReturnRequestStatus = asyncHandler(async (req, res) => {
  const { returnId } = req.query;
  if (!returnId) {
    throw new customError(400, "Return ID is required");
  }
  const response = await api.get(`/get_return_request/${returnId}`);
  if (!response.data) {
    throw new customError(500, "Failed to fetch return request status");
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Return request status fetched successfully",
    response.data
  );
});

// setadfast weebhok handler
exports.steadfastWebhookHandler = asyncHandler(async (req, res) => {
  const payload = req.body;
  const token = process.env.STEADFAST_TOKEN;
  console.log("Steadfast Webhook Payload:", payload);
});
