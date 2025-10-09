const mongoose = require("mongoose");

// Main Cart Schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          default: null,
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          default: null,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitTotalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        size: {
          type: String,
          trim: true,
          required: true,
        },
        color: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmountOfWholeProduct: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Export model
module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
