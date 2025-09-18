const express = require("express");
const _ = express.Router();
const productController = require("../../controller/product.controller");
const upload = require("../../middleware/multer.middleware");
_.route("/create-product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.createProduct
);
_.route("/getall-product").get(productController.getAllProduct);
_.route("/update-productinfo/:slug").put(productController.updateProductInfo);
_.route("/upload-productimage/:slug").put(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.uploadProductImage
);
_.route("/delete-productimage/:slug").delete(
  productController.deleteProductImage
);
_.route("/search-product").get(productController.searchProductbyCategoryothers);
_.route("/product-pagination").get(productController.productpagination);

module.exports = _;
