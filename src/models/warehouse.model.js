const mongoose = require("mongoose");
const { customError } = require("../../utils/customError");

const wareHouseSchema = new mongoose.Schema(
  {
    wareHousename: {
      type: String,
      required: [true, "warehouse name required !! "],
      trim: true,
    },

    warehouselocation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Check unique slug
brandSchema.pre("save", async function (next) {
  const wareHousenameexist = await this.constructor.findOne({
    wareHousename: this.wareHousename,
  });
  if (
    wareHousenameexist &&
    wareHousenameexist._id.toString() !== this._id.toString()
  ) {
    throw new customError(401, "wareHouse name already exists");
  }
  next();
});

module.exports =
  mongoose.models.WarehouseLocation ||
  mongoose.model("WarehouseLocation", wareHouseSchema);
