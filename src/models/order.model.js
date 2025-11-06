const mongoose = require("mongoose");
const slugify = require("slugify");
const { customError } = require("../../utils/customError");
const { required } = require("joi");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      trim: true,
    },
    guestId: {
      type: String,
    },
    items: [{}],
    shippinfo: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: { type: String },
      address: { type: String, required: false },
      email: { type: String },
      country: {
        type: String,
        default: "Bangladesh",
      },
    },
    productWeight: { type: Number, default: 0 },
    deliveryCharge: {
      type: mongoose.Types.ObjectId,
      ref: "DeliveryCharge",
    },
    deliveryZone: {
      type: String,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number, // subtotal + deliveryCharge - discount
      required: true,
    },
    // PAYMENT INFO
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,

      default: "Pending",
    },
    // SSLCommerz Payment Gateway Specific
    transactionId: {
      type: String, // sslcommerz transaction_id
      default: null,
    },
    valId: {
      type: String, // sslcommerz val_id used to verify
      default: null,
    },
    currency: {
      type: String,
      default: "BDT",
    },
    paymentGatewayData: {
      type: mongoose.Schema.Types.Mixed, // store full SSLCommerz response if needed
      default: {},
    },

    // ORDER STATUS
    orderStatus: {
      type: String,
      default: "Pending",
    },
    // INVOICE ID
    invoiceId: {
      type: String,
      default: null,
    },
    // COURIER
    courier: {
      name: {
        type: String,
        default: null,
      },
      trackingId: { type: String, default: null },
      rawResponse: { type: mongoose.Schema.Types.Mixed, default: null },
      status: {
        type: String,
        default: "pending",
      },
    },
    returnStatus: {
      type: String,
      default: "No Request",
    },
    returnId: {
      type: Number,
    },
    returnStatusHistory: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    followUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    totalQuantity: { type: Number, default: 0 },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
