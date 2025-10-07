const mongoose = require('mongoose');
const slugify = require('slugify');
const { customError } = require('../../utils/customError');

const couponSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 50,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'tk'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Make a slug using the code
couponSchema.pre('save', function (next) {
  if (this.isModified('code')) {
    this.slug = slugify(this.code, {
      replacement: '-',
      remove: undefined,
      lower: true,
      strict: false,
      trim: true,
    });
  }
  next();
});

// Check if the slug is already in use
couponSchema.pre('save', async function (next) {
  const slug = await this.constructor.findOne({ slug: this.slug });
  if (slug && slug._id.toString() !== this._id.toString()) {
    throw new customError(401, 'Coupon code already exists');
  }
  next();
});

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
