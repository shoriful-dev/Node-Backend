const { log } = require("console");
const { customError } = require("../../utils/customError");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "daljcyuxe",
  api_key: "623541558237391",
  api_secret: "eQ8vwxk_5aR3C6jDCT7wqTR9hXo",
});
exports.uploadCloudinaryFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      auto: "format",
      quality: "auto",
      fetch_format: "auto",
      resource_type: "image",
    });

    // now optimize the image
    const url = await cloudinary.url(result.public_id, {
      resource_type: "image",
    });

    fs.unlinkSync(filePath);
    return url;
  } catch (error) {
    console.log("error from cloudinary File upload", error);
    throw new customError(400, error.message);
  }
};

// delte coudinary image
exports.deleteCloudinaryFile = async (publicId) => {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result;
  } catch (error) {
    console.log("error from cloudinary File delete", error);
    throw new customError(400, error.message);
  }
};

// extract public id
exports.getPublicId = (imageUrl) => {
  const parts = imageUrl.split("/");
  const cloudinaryPublicURl = parts[parts.length - 1];
  return cloudinaryPublicURl.split("?")[0];
};
