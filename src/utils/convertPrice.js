const convertPrice = (price) => {
  return parseInt(price.replace(/([৳,])/, ""));
};

export default convertPrice;
