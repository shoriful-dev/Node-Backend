const express = require("express");
const _ = express.Router();
const brandController = require("../../controller/brand.controller");
const upload = require("../../middleware/multer.middleware");
const { authguard } = require("../../middleware/authGuard.middleware");

_.route("/create-brand").post(
  authguard,
  upload.fields([{ name: "image", maxCount: 1 }]),
  brandController.createBrand
);
_.route("/all-brand").get(brandController.getAllBrand);
_.route("/single-brand/:slug").get(brandController.getsingleBrand);
_.route("/delete-brand/:slug").delete(brandController.deleteBrand);

module.exports = _;
