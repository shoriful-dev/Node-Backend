const mongoose = require('mongoose');
const slugify = require('slugify');
const { customError } = require('../../utils/customError');

const discountSchema = new mongoose.Schema(
  {
    discountValidFrom: {
      type: Date,
      required: true,
    },
    discountValidTo: {
      type: Date,
      required: true,
    },
    discountName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    discountValueByAmount: {
      type: Number,
      default: 0,
    },
    discountValueByPercentance: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      enum: ['tk', 'percentance'],
      required: true,
    },
    discountPlan: {
      type: String,
      enum: ['flat', 'category', 'product', 'subcategory'],
      required: true,
    },
    targetProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    targetCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    targetSubcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Generate slug before save
discountSchema.pre('save', function (next) {
  if (this.isModified('discountName')) {
    this.slug = slugify(this.discountName, {
      replacement: '-',
      lower: true,
      strict: false,
      trim: true,
    });
  }
  next();
});

// Ensure unique slug
discountSchema.pre('save', async function (next) {
  const slug = await this.constructor.findOne({ slug: this.slug });
  if (slug && slug._id.toString() !== this._id.toString()) {
    throw new customError(401, 'Discount name already exists');
  }
  next();
});

// Update slug when name changes in update
discountSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.discountName) {
    update.slug = slugify(update.discountName, {
      replacement: '-',
      lower: true,
      strict: false,
      trim: true,
    });
    this.setUpdate(update);
  }
  next();
});

module.exports = mongoose.models.Discount || mongoose.model('Discount', discountSchema);
