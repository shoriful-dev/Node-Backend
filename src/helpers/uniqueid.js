const crypto = require("crypto");

exports.getTransactionId = () => {
  const value = crypto.randomUUID();
  const parts = value.split("-");
  return parts[parts.length - 1];
};

// getProductName

exports.getProductName = (items) => {
  let allName = [];
  items.map((product) => {
    if (product.variantType == "singleVariant") {
      allName.push(product.name);
    } else {
      allName.push(product.variantName);
    }
  });

  return allName.join(",");
};
