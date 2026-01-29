const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const roleSchema = new Schema(
    {
        name: {
            type: String,
            trim: true, 
            required: [true, 'Role Name is required'],
            
        },
        slug:{
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        }
     
    },
    { timestamps: true }
);


// make a slug before save
roleSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// check alrady this slug exist or not
roleSchema.pre('save', async function (next) {
    const Role = mongoose.model('Role', roleSchema);
    const existingRole = await Role.findOne({ slug: this.slug });
    if (existingRole) {
        const err = new Error('Role with this name already exists');
        next(err);
    } else {
        next();
    }   
});

module.exports = mongoose.model('Role', roleSchema);