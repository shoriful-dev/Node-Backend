const express = require("express");
const _ = express.Router();
const variantController = require("../../controller/variant.controller");
const upload = require("../../middleware/multer.middleware");

_.route("/create-variant").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  variantController.createVariant
);

_.route("/getall-variant").get(variantController.getAllVarinat);
_.route("/single-variant/:slug").get(variantController.getSingleVariant);
_.route("/delete-variant/:slug").delete(variantController.deleteVariant);

module.exports = _;
