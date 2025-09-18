const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const productModel = require("../models/product.model");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
  getPublicId,
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

// update product info
exports.updateProductInfo = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug missing");

  const updateProduct = await productModel.findOneAndUpdate(
    { slug },
    { ...req.body },
    { new: true }
  );
  if (!updateProduct) throw new customError(401, "product not found !! ");
  apiResponse.sendSuccess(
    res,
    200,
    "product update sucessfully",
    updateProduct
  );
});

// update product image
exports.uploadProductImage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug missing");

  const Product = await productModel.findOne({ slug });
  if (!Product) throw new customError(401, "product not found !! ");
  // upload image into cloudinary
  for (let imagePath of req?.files?.image) {
    const imageUrl = await uploadCloudinaryFile(imagePath.path);
    Product.image.push(imageUrl);
  }
  await Product.save();
  apiResponse.sendSuccess(
    res,
    200,
    "product new image upload sucessfully",
    Product
  );
});

// delete product image
exports.deleteProductImage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { imageId } = req.body;
  if (!slug && !imageId.length)
    throw new customError(401, "slug or imageid missing");
  const Product = await productModel.findOne({ slug });
  if (!Product) throw new customError(401, "product not found !! ");
  const updatedImage = Product.image.filter((img) => img !== imageId);
  const public_id = getPublicId(imageId);
  await deleteCloudinaryFile(public_id);
  Product.image = updatedImage;
  await Product.save();
  apiResponse.sendSuccess(
    res,
    200,
    "product  image deleted sucessfully",
    Product
  );
});

// search product using categoryid  or brandid price and tag
exports.searchProductbyCategoryothers = asyncHandler(async (req, res) => {
  const { category, subcategory, brand, tag } = req.query;
  let query = {};
  if (category) {
    query.category = category;
  }
  if (subcategory) {
    query.subcategory = subcategory;
  }
  if (brand) {
    if (Array.isArray(brand)) {
      query.brand = { $in: brand };
    } else {
      query.brand = brand;
    }
  }
  if (tag) {
    if (Array.isArray(tag)) {
      query.tag = { $in: tag };
    } else {
      query.tag = tag;
    }
  }
  const product = await productModel
    .find(query)
    .populate("category subCategory brand");
  if (!product) throw new customError(401, "product not found !! ");
  apiResponse.sendSuccess(res, 200, "product retrive sucessfullly", product);
});

// product pagination
exports.productpagination = asyncHandler(async (req, res) => {
  const { page, item } = req.query;
  const pageNum = parseInt(page, 10);
  const itemNum = parseInt(item, 10);
  if (!pageNum || !itemNum)
    throw new customError(401, "pagenumber or itemnumber not found!");
  const skip = (pageNum - 1) * itemNum;
  const totalitem = await productModel.countDocuments();
  const totalPage = Math.round(totalitem / item);
  const product = await productModel
    .find()
    .skip(skip)
    .limit(itemNum)
    .populate("category subcategory , brand");
  if (!product || product.length === 0)
    throw new customError(401, "product not found !! ");

  apiResponse.sendSuccess(res, 200, "product retrive sucessfullly", {
    ...product,
    totalPage,
    totalitem,
  });
});
