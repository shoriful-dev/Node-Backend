const mongoose = require('mongoose');
const slugify = require('slugify');
const { customError } = require('../../utils/customError');


const deliveryChargeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
        },
        amount: {
            type: Number,
            min: 0,
            required: true
        }
        ,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Generate slug before save
deliveryChargeSchema.pre('save', function (next) {
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

// Check unique slug
deliveryChargeSchema.pre('save', async function (next) {
    const slug = await this.constructor.findOne({ slug: this.slug });
    if (slug && slug._id.toString() !== this._id.toString()) {
        throw new customError(401, 'DeliveryCharge name already exists');
    }
    next();
});

module.exports = mongoose.models.DeliveryCharge || mongoose.model('DeliveryCharge', deliveryChargeSchema);
