const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const productModel = require("../models/product.model");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helpers/cloudinary");
const { validateProduct } = require("../validation/product.validation");
const { generateQR, generateBarcode } = require("../helpers/Qrandbarcode");

// create product
exports.createProduct = asyncHandler(async (req, res) => {
  const data = await validateProduct(req);
  const { image } = data;
  //   upload image into cloudinary
  let allImageinfo = [];
  for (let img of image) {
    const imginfo = await uploadCloudinaryFile(img.path);
    allImageinfo.push(imginfo);
  }

  // update info into database
  const product = await productModel.create({ ...data, image: allImageinfo });
  if (!product) {
    throw new customError(500, "product created Failed !!");
  }
  //   const QrCodeLink = `www.nodeman.com/product/${product.slug}`;
  const QrCodeLink = `https://evaly.com.bd/products/intel-core-i5-8gb-ram-128-gb-ssd-windows-10-with-19-inch-full-hd-monitor-desktop-pc-7119289`;

  //  make a qrCode
  const QrCode = await generateQR(QrCodeLink);
  //   make a barcode
  const barCode = await generateBarcode(product.sku);

  //   now update the barcode and qrcode into db
  product.QrCode = QrCode;
  product.barCode = barCode;
  await product.save();
  apiResponse.sendSuccess(res, 201, "product created sucessfully", product);
});

// get all product
exports.getAllProduct = asyncHandler(async (_, res) => {
  const allproduct = await productModel
    .find({})
    .populate({
      path: "category subCategory brand",
    })
    .sort({ createdAt: -1 });
  if (!allproduct?.length) {
    throw new customError(401, "Product not found !!");
  }
  apiResponse.sendSuccess(res, 201, "product created sucessfully", allproduct);
});
