const { required } = require("joi");
const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    image: [{}],
    tag: [String],
    manufactureCountry: String,
    rating: Number,
    warrantyInformation: String,
    warrantyClaim: {
      type: Boolean,
      default: true,
    },
    warrentyexpires: Date,
    availabilityStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Preorder"],
    },
    shippingInformation: String,
    sku: {
      type: String,
      unique: true,
    },
    QrCode: String,
    barCode: String,
    groupUnit: {
      type: String,
      enum: ["Box", "Packet", "Dozen", "Custom"],
    },
    groupUnitQuantity: Number,
    unit: {
      type: String,
      enum: ["Piece", "Kg", "Gram", "Packet", "Custom"],
    },
    variantType: {
      type: String,
      enum: ["singleVariant", "multipleVariant"],
      required: true,
    },
    size: {
      type: String,
    },
    color: String,
    stock: Number,
    warehouseLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseLocation",
    },
    retailPrice: {
      type: Number,
    },
    retailPriceProfitAmount: Number,
    retailPriceProfitPercentance: {
      type: Number,
      max: 100,
    },
    wholesalePrice: {
      type: Number,
    },
    alertQuantity: Number,
    stockAlert: Boolean,
    instock: Boolean,
    isActive: {
      type: Boolean,
      default: true,
    },
    minimumOrderQuantity: Number,
  },
  { timestamps: true }
);

// Generate slug before save
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

// Ensure unique slug
productSchema.pre("save", async function (next) {
  const slug = await this.constructor.findOne({ slug: this.slug });
  if (slug && slug._id.toString() !== this._id.toString()) {
    return next(new Error("Product name already exists"));
  }
  next();
});

// Update slug when name changes in update
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, {
      replacement: "-",
      lower: true,
      strict: true,
      trim: true,
    });
    this.setUpdate(update);
  }
  next();
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
