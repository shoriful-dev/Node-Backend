const mongoose = require('mongoose');
const { Schema} = mongoose;
const slugify = require('slugify');
const permissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true  
    },
    slug:{
        type: String,
        unique: true,
    }
}, {timestamps: true});

// make a slug usisng slugify
permissionSchema.pre("save"  , function(next){
    this.slug = slugify(this.name , {lower:true , strict:true});
    next();
})

// check if the slug is unique
permissionSchema.pre("save" , async function(next){
    const permission = await mongoose.models.Permission.findOne({slug: this.slug});
    if(permission){
        const err = new Error("Permission with this name already exists");
        next(err);
    }
    next();
});
const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;