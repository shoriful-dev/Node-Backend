const QRCode = require("qrcode");
const bwipjs = require("bwip-js");
const { customError } = require("../../utils/customError");
exports.generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      margin: 1,
    });
  } catch (err) {
    throw new customError(500, "Generate qrCode Error" + err);
  }
};

// generate bar code
exports.generateBarcode = async (text) => {
  try {
    return bwipjs.toSVG({
      bcid: "code128",
      text: text,
      height: 12,
      includetext: true,
      textxalign: "center",
      textcolor: "000000",
    });
  } catch (error) {
    throw new customError(500, "Generate barCode Error" + error);
  }
};
