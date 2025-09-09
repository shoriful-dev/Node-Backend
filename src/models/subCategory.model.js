const mongoose = require('mongoose');
const slugify = require('slugify');
const { customError } = require('../../utils/customError');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// make slug using name
subCategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      replacement: '-',
      lower: true,
      strict: false,
      trim: true,
    });
  }
  next();
});

subCategorySchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (update.name) {
    update.slug = slugify(update.name, {
      replacement: '-',
      lower: true,
      strict: false,
      trim: true,
    });
    this.setUpdate(update);
  }

  next();
});

// check if slug already exists
subCategorySchema.pre('save', async function (next) {
  const slug = await this.constructor.findOne({ slug: this.slug });
  if (slug && slug._id.toString() !== this._id.toString()) {
    throw new customError(401, 'SubCategory Name already exist');
  }
  next();
});

module.exports = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);
