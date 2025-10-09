const { string } = require("joi");
const mongoose = require("mongoose");
const slugify = require("slugify");

const variantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantName: {
      type: String,
      required: true,
      trim: true,
    },
    variantDescription: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    size: {
      type: String,
      default: "N/A",
    },
    color: {
      type: String,
      default: "N/A",
    },
    stockVariant: {
      type: Number,
      required: true,
      min: 0,
    },
    alertVariantStock: {
      type: Number,
      default: 5,
      min: 0,
    },
    retailPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    wholesalePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    image: [
      {
        type: String,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Generate slug before save
variantSchema.pre("save", function (next) {
  if (this.isModified("variantName")) {
    this.slug = slugify(this.variantName, {
      replacement: "-",
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

// Ensure unique slug
variantSchema.pre("save", async function (next) {
  const existing = await this.constructor.findOne({ slug: this.slug });
  if (existing && existing._id.toString() !== this._id.toString()) {
    return next(new Error("Variant name already exists"));
  }
  next();
});

// Update slug on name change
variantSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.variantName) {
    update.slug = slugify(update.variantName, {
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
  mongoose.models.Variant || mongoose.model("Variant", variantSchema);
