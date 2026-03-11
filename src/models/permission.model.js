const mongoose = require("mongoose");
const { Schema } = mongoose;
const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
