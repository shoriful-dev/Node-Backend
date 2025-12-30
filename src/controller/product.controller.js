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
   let allImageinfo = [];
  if (data.variantType == "singleVariant") {
    const { image } = data;
    //   upload image into cloudinary
    for (let img of image) {
      const imginfo = await uploadCloudinaryFile(img.path);
      allImageinfo.push(imginfo);
    }

  }

  // update info into database
  const product = await productModel.create({ ...data, image: allImageinfo?.length>0 ? allImageinfo: null });
  if (!product) {
    throw new customError(500, "product created Failed !!");
  }
  //   const QrCodeLink = `www.nodeman.com/product/${product.slug}`;
  const QrCodeLink = `https://evaly.com.bd/products/intel-core-i5-8gb-ram-128-gb-ssd-windows-10-with-19-inch-full-hd-monitor-desktop-pc-7119289`;

  //  make a qrCode
  const QrCode = await generateQR(QrCodeLink);
  //   make a barcode
  let barCode = null
  if (data.variantType == "singleVariant") {
    barCode = await generateBarcode(product.sku);
  }

  //   now update the barcode and qrcode into db
  product.QrCode = QrCode;
  product.barCode = barCode;
  await product.save();
  apiResponse.sendSuccess(res, 201, "product created sucessfully", product);
});

// get all product
exports.getAllProduct = asyncHandler(async (req, res) => {
  const { ptype } = req.query;
  let queryobj = {};
  if (ptype == "single") {
    queryobj.variantType = "singleVariant";
  } else if (ptype == "multiple") {
    queryobj.variantType = "multipleVariant";
  } else {
    queryobj = {};
  }

  const allproduct = await productModel
    .find(queryobj)
    .populate({
      path: "category subCategory brand variant",
    })
    .select("-QrCode -barCode")
    .sort({ createdAt: -1 });
  if (!allproduct?.length) {
    throw new customError(401, "Product not found !!");
  }
  apiResponse.sendSuccess(res, 201, "product created sucessfully", allproduct);
});

// get single product
exports.getsingelProduct = asyncHandler(async (req, res) => {
  const { slug } = req.query;
  if (!slug) throw new customError(401, "slug not found !!");
  console.log(slug);
  const allproduct = await productModel
    .findOne({ slug })
    .populate({
      path: "category subCategory brand variant",
    })
    .select("-QrCode -barCode")
    .sort({ createdAt: -1 });
  if (!allproduct) {
    throw new customError(401, "Product not found !!");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "single product get sucessfully",
    allproduct
  );
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

// price range
exports.priceRange = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  if ((!minPrice, !maxPrice))
    throw new customError(401, "missing minprice or maxPrice");
  let query;
  if (minPrice && maxPrice) {
    query = { $gte: minPrice, $lte: maxPrice };
  } else if (minPrice) {
    query = { $lte: maxPrice };
  } else if (maxPrice) {
    query = { $gte: maxPrice };
  } else {
    query = {};
  }

  const product = await productModel
    .find({
      retailPrice: query,
    })
    .sort({ createdAt: -1 })
    .populate({
      path: "category subCategory brand",
    });

  if (!product.length) throw new customError(401, "Product not found !!");
  apiResponse.sendSuccess(res, 200, "product retrive sucessfullly ", product);
});

// product order
exports.productOrder = asyncHandler(async (req, res) => {
  const { sort_by } = req.query;
  if (!sort_by) throw new customError(401, "query missing");
  let sortQuery = {};
  if (sort_by == "date-descending") {
    sortQuery = { createdAt: -1 };
  } else if (sort_by == "date-ascending") {
    sortQuery = { createdAt: 1 };
  } else if (sort_by == "price-descending") {
    sortQuery = { retailPrice: -1 };
  } else if (sort_by == "price-ascending") {
    sortQuery = { retailPrice: 1 };
  } else if (sort_by == "name-descending") {
    sortQuery = { name: -1 };
  } else if (sort_by == "name-ascending") {
    sortQuery = { name: 1 };
  } else {
    sortQuery = {};
  }

  const product = await productModel.find({}).sort(sortQuery);
  if (!product.length) throw new customError(401, "product not found");
  apiResponse.sendSuccess(res, 200, "product retrive sucessfullly", product);
});

// delete product
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug is not define !!");
  const product = await productModel.findOne({ slug });
  if (!product) throw new customError(401, "product not found !!");

  for (let img of product.image) {
    const publicid = getPublicId(img);
    await deleteCloudinaryFile(publicid);
  }
  const confrimDelete = await productModel.findOneAndDelete({ slug });
  if (!confrimDelete) throw new customError(500, "delete failed !!");
  apiResponse.sendSuccess(
    res,
    200,
    "product deleted sucessfullly",
    confrimDelete
  );
});

// product active deactive
exports.changeProductMode = asyncHandler(async (req, res) => {
  const { slug, mode } = req.query;
  if (!slug) throw new customError(401, "slug is not define !!");
  const product = await productModel.findOne({ slug });
  if (!product) throw new customError(401, "product not found !!");

  product.isActive = mode == "active" ? true : false;
  await product.save();

  apiResponse.sendSuccess(
    res,
    200,
    "product mode update sucessfullly",
    confrimDelete
  );
});
