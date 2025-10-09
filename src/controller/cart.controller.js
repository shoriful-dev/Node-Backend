const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const varinatModel = require("../models/varinant.model");
const { validateCartItemAction } = require("../validation/cart.validation");

// addToCart
exports.addToCart = asyncHandler(async (req, res) => {
  const { user, guestId, productId, variantId, color, size, quantity, coupon } =
    await validateCartItemAction(req);
  // now make a addtoCartobject
  let cart = {};
  let product = {};
  let variant = {};
  let promiseArr = [];
  let price = 0;

  //   cart = new cartModel({
  //     user: user || null,
  //     guestId: guestId || null,
  //     items: [],
  //     coupon: coupon,
  //   });

  if (productId) {
    product = await productModel.findById(productId);
    console.log("product", product);
  }
  if (variantId) {
    variant = await varinatModel.findById(variantId);
  }
});
