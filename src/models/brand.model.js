// const mongoose = require('mongoose');
// const slugify = require('slugify');
// const { customError } = require('../../utils/customError');

// const brandSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     slug: {
//       type: String,
//     },
//     image: {
//       type: String,
//       required: true,
//     },
//     since: {
//       type: Number,
//       required: true,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// // Generate slug before save
// brandSchema.pre('save', function (next) {
//   if (this.isModified('name')) {
//     this.slug = slugify(this.name, {
//       replacement: '-',
//       lower: true,
//       strict: false,
//       trim: true,
//     });
//   }
//   next();
// });

// // Check unique slug
// brandSchema.pre('save', async function (next) {
//   const slug = await this.constructor.findOne({ slug: this.slug });
//   if (slug && slug._id.toString() !== this._id.toString()) {
//     throw new customError(401, 'Brand name already exists');
//   }
//   next();
// });

// module.exports = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
