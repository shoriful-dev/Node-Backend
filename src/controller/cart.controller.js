const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const varinatModel = require("../models/varinant.model");
const couponModel = require("../models/coupon.model");
const { validateCartItemAction } = require("../validation/cart.validation");

// apply coupon
const applyCoupon = async (originalAmount, coupon) => {
  let afterdiscount = 0;
  let discountAmount = 0;
  try {
    const couponInstace = await couponModel.findOne({ code: coupon });
    const {
      expireAt,
      usedCount,
      isActive,
      usageLimit,
      discountType,
      discountValue,
    } = couponInstace;
    // if (expireAt >= Date.now()) {
    //   throw new customError(401, "coupon expire !");
    // }
    if (usageLimit < usedCount) throw new customError(401, "limit expire !");
    if (discountType == "percentage") {
      discountAmount = Math.ceil((originalAmount * discountValue) / 100);
      afterdiscount = Math.ceil(originalAmount - discountAmount);
    } else {
      afterdiscount = originalAmount - discountValue;
    }
    // count increase
    couponInstace.usedCount += 1;
    await couponInstace.save();
    return {
      afterdiscount,
      discountAmount,
      couponInstace,
    };
  } catch (error) {
    if (couponInstace) {
      await couponModel.findOneAndUpdate(
        { code: coupon },
        { usedCount: usedCount - 1 }
      );
    }
    console.log("error from apply coupon", error);
  }
};
// addToCart
exports.addToCart = asyncHandler(async (req, res) => {
  const { user, guestId, productId, variantId, color, size, quantity, coupon } =
    await validateCartItemAction(req);
  const query = user ? { user } : { guestId };
  // now make a addtoCartobject
  let cart = {};
  let product = {};
  let variant = {};
  let promiseArr = [];
  let price = 0;

  if (productId) {
    product = await productModel.findById(productId);
    price = product.retailPrice;
  }
  if (variantId) {
    variant = await varinatModel.findById(variantId);
    price = variant.retailPrice;
  }

  // find cart
  cart = await cartModel.findOne(query);
  if (!cart) {
    cart = new cartModel({
      user: user,
      guestId: guestId,
      items: [
        {
          product: productId || null,
          variant: variantId || null,
          quantity: quantity,
          price: productId ? price : price,
          unitTotalPrice: productId
            ? Math.floor(price * quantity)
            : Math.floor(price * quantity),
          size,
          color,
        },
      ],
    });
  } else {
    const findIitemIndex = cart.items.findIndex(
      (cartItem) =>
        cartItem.product == productId || cartItem.variant == variantId
    );

    if (findIitemIndex > 0) {
      cart.items[findIitemIndex].quantity += quantity || 1;
      cart.items[findIitemIndex].unitTotalPrice = Math.floor(
        cart.items[findIitemIndex].price * cart.items[findIitemIndex].quantity
      );
    } else {
      cart.items.push({
        product: productId || null,
        variant: variantId || null,
        quantity: quantity,
        price: productId ? price : price,
        unitTotalPrice: productId
          ? Math.floor(price * quantity)
          : Math.floor(price * quantity),
        size,
        color,
      });
    }
  }

  const totalcartInfo = cart.items.reduce(
    (acc, item) => {
      acc.totalprice += item.unitTotalPrice;
      acc.totalproduct += item.quantity;
      return acc;
    },
    {
      totalproduct: 0,
      totalprice: 0,
    }
  );

  cart.totalAmountOfWholeProduct = totalcartInfo.totalprice;
  cart.totalproduct = totalcartInfo.totalproduct;

  await cart.save();
  apiResponse.sendSuccess(res, 201, "add to cart sucessfully", cart);
});

// apply coupon
exports.applyCoupon = asyncHandler(async (req, res) => {
  const { coupon, guestId, userid } = req.body;
  const query = userid ? { user: userid } : { guestId };
  const cart = await cartModel.findOne(query);
  const { afterdiscount, discountAmount, couponInstace } = await applyCoupon(
    cart.totalAmountOfWholeProduct,
    coupon
  );
  cart.coupon = couponInstace._id;
  cart.discountAmount = discountAmount;
  cart.discountType = couponInstace.discountType;
  cart.totalAmountOfWholeProduct = afterdiscount;
  await cart.save();
  apiResponse.sendSuccess(res, 200, "apply coupon sucessfully", cart);
});
