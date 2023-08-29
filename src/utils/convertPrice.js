// Cleans the Price string for anystore.

const convertPrice = (price) => {
  return parseInt(price.replace(/([^\d]+)/g, ""));
};

export default convertPrice;
