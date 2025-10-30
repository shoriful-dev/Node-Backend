const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the invoice model
const invoiceSchema = new Schema(
  {
    // A unique identifier for the invoice
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    // Reference to the order this invoice belongs to
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Invoice model from the schema
const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

// Export the model for use in other files
module.exports = Invoice;
